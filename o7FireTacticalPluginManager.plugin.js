/**
 * @name o7FireTacticalPluginManager
 * @author o7-Fire
 * @authorLink https://github.com/o7-Fire
 * @website https://github.com/o7-Fire
 * @source https://raw.githubusercontent.com/o7-Fire/Discord-Fire/main/o7FireTacticalPluginManager.plugin.js
 */

/*@cc_on
@if (@_jscript)
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();
@else@*/
class o7FireTacticalPluginManager {
    config = {
        "info": {
            "name": "o7FireTacticalPluginManager",
            "author": "o7Fire",
            "version": "0.5.2",
            "description": "#Tools"
        },
        "changeLog": {
            "fix": {
                "how i do use changelog": "fix initialize and update"
            }
        }
    };
    constructor() {
        this._config = this.config;
    }

    getName() {
        return this.config.info.name;
    }

    getAuthor() {
        return this.config.info.author;
    }

    getVersion() {
        return this.config.info.version;
    }

    getDescription() {
        return this.config.info.description;
    }

    load() {
        try {
            ZeresPluginLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), 'https://raw.githubusercontent.com/o7-Fire/Discord-Fire/main/o7FireTacticalPluginManager.plugin.js');
        }catch (e){}
        this.add("https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
        this.add("https://raw.githubusercontent.com/1Lighty/BetterDiscordPlugins/master/Plugins/MessageLoggerV2/MessageLoggerV2.plugin.js");
        this.add("https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/ShowHiddenChannels/ShowHiddenChannels.plugin.js");
        this.add("https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/GoogleTranslateOption/GoogleTranslateOption.plugin.js");
        this.add("https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/CreationDate/CreationDate.plugin.js");
        this.add("https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/CompleteTimestamps/CompleteTimestamps.plugin.js");
	this.add("https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/DoNotTrack/DoNotTrack.plugin.js");
    }
    // Start/Stop
    start() {
        var libraryScript = document.getElementById('zeresLibraryScript');
	if (!libraryScript) {
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);
	}

	if (typeof window.ZeresLibrary !== "undefined") this.initialize();
	else libraryScript.addEventListener("load", () => { this.initialize(); });
    }
       
    stop() {
        PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has stopped.");
    };
    //  Initialize
    initialize() {
        this.initialized = true;
        PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
    }
    add(url) {
        let name = url.substring(url.lastIndexOf("/") + 1, url.length)
        if (!require("fs").existsSync(require("path").join(BdApi.Plugins.folder, name)))
            BdApi.showConfirmationModal("Arsenal Missing", `The plugin ${name} is missing. Please click "Download Now" to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get(url, async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=" + url);
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, name), body, r));
                    });
                }
            });
    }
}
