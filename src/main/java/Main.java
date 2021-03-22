import Atom.File.FileUtility;
import Atom.Time.Time;
import Atom.Utility.Encoder;
import Atom.Utility.Pool;
import Atom.Utility.Utility;
import discord4j.core.DiscordClient;
import discord4j.core.event.domain.lifecycle.ReadyEvent;
import discord4j.core.event.domain.message.MessageCreateEvent;
import discord4j.core.object.entity.Message;
import discord4j.core.object.entity.channel.MessageChannel;

import java.io.*;
import java.nio.file.Files;
import java.util.*;
import java.util.concurrent.TimeUnit;

class Main {
	public final static Map<Long, PythonExecutor> cache = Collections.synchronizedMap(new HashMap<>());
	public static DiscordClient client;
	public static HashSet<Long> whitelist = new HashSet<>();
	public static File list = new File("jython-whitelist.txt"), settings = new File("jython-settings.properties");
	public static HashMap<String, String> map = new HashMap<>();
	public static boolean linePerLineOutput = true;
	
	static {
		if (settings.exists()) {
			try {
				map = Encoder.parseProperty(Files.readString(settings.toPath()));
			}catch (IOException e) {
				e.printStackTrace();
			}
		}
		
	}
	
	public static void main(String[] args) throws IOException {
		if (args.length == 0) {
			System.out.println("need token on argument");
			return;
		}
		linePerLineOutput = Boolean.parseBoolean(getSettings("linePerLineOutput", "true"));
		System.out.println("linePerLineOutput: " + linePerLineOutput);
		if (!list.exists()) {
			try {
				whitelist.add(332394297536282634L);
				whitelist.add(343591759332245505L);
				String[] array = new String[whitelist.size()];
				Long[] arrayL = whitelist.toArray(new Long[0]);
				for (int i = 0; i < arrayL.length; i++) {
					array[i] = String.valueOf(arrayL[i]);
				}
				Files.writeString(list.toPath(), Utility.joiner(array, System.lineSeparator()));
			}catch (Throwable t) {
				t.printStackTrace();
			}
		}else {
			int i = 0;
			for (String s : Files.readAllLines(list.toPath())) {
				i++;
				try {
					whitelist.add(Long.parseLong(s));
				}catch (NumberFormatException t) {
					System.out.println("Error: " + t.getMessage());
					System.out.println("Line: " + i);
				}
			}
		}
		
		String token = args[0];
		System.out.println("\"" + token + "\"");
		client = DiscordClient.create(token);
		client.login().doOnSuccess(s -> {
			s.getEventDispatcher().on(MessageCreateEvent.class).doOnError(Throwable::printStackTrace).subscribe(messageCreateEvent -> Pool.submit(() -> messageCreate(messageCreateEvent)));
			s.getEventDispatcher().on(ReadyEvent.class).subscribe(readyEvent -> System.out.println("Ready " + readyEvent.getSelf().getTag()));
		}).block();
		System.out.println("done");
		Utility.convertThreadToInputListener("", s -> {
		
		});
	}
	
	public static String getSettings(String key, String def) {
		if (map.containsKey(key)) return map.get(key);
		map.put(key, def);
		Pool.submit(() -> {
			try {
				Files.writeString(settings.toPath(), Encoder.property(map));
			}catch (IOException e) {
				e.printStackTrace();
			}
		});
		return def;
	}
	
	public static void messageCreate(MessageCreateEvent messageCreateEvent) {
		if (messageCreateEvent.getMessage().getContent().equals("test")) {
			messageCreateEvent.getMessage().getChannel().subscribe(c -> c.createMessage("Alive").subscribe());
		}
		String prefix = getSettings("prefix", "py");
		String content = messageCreateEvent.getMessage().getContent();
		if (content.startsWith(getSettings("prefixHelp", "help"))) {
			messageCreateEvent.getMessage().getChannel().subscribe(m -> {
				m.createMessage("destroy: destroy executor\nreset: reset executor\nprefix:" + prefix).subscribe();
			});
		}else if (content.startsWith(prefix)) {
			messageCreateEvent.getMessage().getAuthor().ifPresent(author -> {
				if (!whitelist.contains(author.getId().asLong())) return;
				
				String s = messageCreateEvent.getMessage().getContent().replaceFirst(prefix, "");
				MessageChannel channel = messageCreateEvent.getMessage().getChannel().block();
				if (content.equals("destroy")) {
					cache.put(author.getId().asLong(), null);
					assert channel != null;
					channel.createMessage("Removed executor for" + author.getTag()).subscribe();
					return;
				}
				if (content.equals("reset") || !cache.containsKey(author.getId().asLong())) {
					PythonExecutor old = cache.get(author.getId().asLong());
					String exec;
					if (old != null) exec = old.executor();
					else exec = s;
					if (exec.isEmpty() || !exec.startsWith("python")) {
						exec = "python";
					}
					String finalExec = exec;
					try {
						Runtime.getRuntime().exec(exec);
					}catch (IOException e) {
						assert channel != null;
						channel.createMessage("no python version found").subscribe();
						return;
					}
					assert channel != null;
					Message m = channel.createMessage("Creating new" + exec + " executor for: " + author.getTag()).block();
					
					try {
						Time t = new Time();
						PythonExecutor e;
						e = new InteractiveExecutor(channel, finalExec);
						//e = new FileExecutor(channel, finalExec);//uncomment this to use file method
						cache.put(author.getId().asLong(), e);
						assert m != null;
						m.edit(messageEditSpec -> messageEditSpec.setContent("Finished making " + finalExec + " executor for " + author.getTag() + " in " + t.elapsed().convert(TimeUnit.MILLISECONDS).toString())).subscribe();
						e.flush();
					}catch (Throwable t) {
						t.printStackTrace();
						assert m != null;
						m.edit(messageEditSpec -> messageEditSpec.setContent("Error while making " + finalExec + " executor for " + author.getTag() + ": " + t.getMessage())).subscribe();
					}
					if (s.isEmpty() || s.startsWith("python")) return;
				}
				
				
				PythonExecutor executor = cache.get(author.getId().asLong());
				System.out.println(author.getTag() + ": " + s);
				try {
					executor.exec(s);
					executor.flush();
				}catch (Throwable t) {
					executor.flush(t.getMessage());
				}finally {
					executor.flush();
				}
			});
		}
	}
	
	public interface PythonExecutor {
		
		void exec(String code) throws Throwable;
		
		void flush(String s);
		
		default void flush() {
			flush("");
		}
		
		String executor();
	}
	
	public static class InteractiveExecutor extends DiscordPythonExecutor {
		Process interpreter;
		BufferedWriter input;
		BufferedReader read;
		
		public InteractiveExecutor(MessageChannel channel, String exec) throws IOException {
			super(channel, exec);
			interpreter = new ProcessBuilder(exec, "-i").redirectErrorStream(true).directory(settings.getParentFile()).start();
			OutputStreamWriter osw = new OutputStreamWriter(interpreter.getOutputStream());
			input = new BufferedWriter(osw);
			read = new BufferedReader(new InputStreamReader(interpreter.getInputStream()));
			Pool.submit(() -> {
				try {
					String line;
					while ((line = read.readLine()) != null) {
						if (line.isEmpty()) continue;
						if (line.startsWith(">>>")) line = line.replaceFirst(">>>", "");
						outputStream.write(line);
						outputStream.write("\n");
					}
					read.close();
				}catch (IOException e) {
					e.printStackTrace();
				}
			});
		}
		
		@Override
		public void exec(String code) throws Throwable {
			for (String s : code.split("\n")) {
				if (s.isEmpty()) continue;
				input.write(s);
				input.newLine();
				input.flush();
			}
		}
		
	}
	
	public static class FileExecutor extends DiscordPythonExecutor {
		
		public FileExecutor(MessageChannel channel, String exec) {
			super(channel, exec);
		}
		
		public void exec(String ss) throws IOException {
			File f = FileUtility.temp();
			Files.writeString(f.toPath(), ss);
			new ProcessBuilder(exec, f.getAbsolutePath()).directory(settings.getParentFile()).redirectErrorStream(true).start().getInputStream().transferTo(outputStream);
		}
		
	}
	
	public static abstract class DiscordPythonExecutor implements PythonExecutor {
		public DiscordOutput outputStream;
		public String exec;
		
		public DiscordPythonExecutor(MessageChannel channel, String exec) {
			this.exec = exec;
			outputStream = new DiscordOutput(channel);
		}
		
		@Override
		public void flush(String s) {
			outputStream.write(s);
			outputStream.manualFlush();
		}
		
		@Override
		public String executor() {
			return exec;
		}
		
		public void copy(InputStream in) {
			Pool.daemon(() -> {
				try {
					DiscordOutput out = outputStream;
					BufferedReader reader = new BufferedReader(new InputStreamReader(in));
					String line;
					while ((line = reader.readLine()) != null) {
						line += "\n";
						out.write(line);
					}
				}catch (IOException e) {
					e.printStackTrace();
				}
			}).start();
		}
	}
	
	public static class DiscordOutput extends OutputStream {
		StringBuilder sb = new StringBuilder();
		MessageChannel channel;
		
		public DiscordOutput(MessageChannel channel) {
			this.channel = channel;
		}
		
		@Override
		public synchronized void write(int b) {
			sb.append((char) b);
			if (linePerLineOutput) {
				if ((((char) b) == '\n' || System.lineSeparator().equals(String.valueOf((char) b)))) manualFlush();
			}
		}
		
		public void write(byte[] b, int off, int len) {
			Objects.checkFromIndexSize(off, len, b.length);
			// len == 0 condition implicitly handled by loop bounds
			for (int i = 0; i < len; i++) {
				write(b[off + i]);
			}
		}
		
		public void write(String s) {
			sb.append(s);
			if (linePerLineOutput && (s.endsWith("\n") || s.endsWith(System.lineSeparator()))) manualFlush();
		}
		
		public void write(byte[] b) {
			write(b, 0, b.length);
		}
		
		public synchronized void manualFlush() {
			String s = toString();
			if (!s.isEmpty()) channel.createMessage(s).subscribe();
			sb = new StringBuilder();
		}
		
		
		@Override
		public String toString() {
			return sb.toString();
		}
	}
}
