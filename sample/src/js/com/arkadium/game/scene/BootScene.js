// ========================= Requirements =========================
var GameSettings = require("../GameSettings");

// ========================= Construction =========================
var BootScene = function (game) {};
module.exports = BootScene;

// ========================= Prototype =========================
BootScene.prototype = {
    // =============== Preload ===============
    preload: function () {
        "use strict";
    },

    // =============== Creation ===============
    create: function () {
        "use strict";
        // Initialize a bunch of settings
        ARK_game_arena_connector.init();
        this.game.input.maxPointers = 1;
        this.game.time.desiredFps = 30;

        // Initialize scale
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        //this.game.scale.pageAlignHorizontally = true;
        //this.game.scale.pageAlignVertically = true;
        //this.game.scale.setMaximum();
        //this.game.scale.refresh();
        //this.game.scale.boot();

        // Determine a bunch of settings
        this.determineAssetScale(); // Determine which asset size to load
        this.determineDevice(); // Desktop, Tablet, or Phone
        this.determinePlatform(); // Android, iOS, or Windows
        this.determineBrowser(); // Chrome, Firefox, Safari, or IE
        this.determineCapability(); // Determine if certain processes can be run
        this.determineLanguage(); // Determine which localization language to use
        this.addKeyCaptures(); // This will allow the game to capture special keys like Backspace, Delete, Home, End, etc.

        // Go to the preloader once we've set up our game
        this.game.state.start('PreloaderScene');
    },

    // ========================= Determination =========================
    determineAssetScale: function() {
        "use strict";
        // Determine which asset scale we should use, so that it looks best on this device
        var maxSideLength = Math.max(this.game.scale.width, this.game.scale.height);
        if (maxSideLength < 720) { // < 480 * 1.5 => use 640*480
            GameSettings.assetScale = GameSettings.AssetScales.small;
            GameSettings.assetScaleTexturePrefix = GameSettings.TextureAssetScalePrefixes.small;
        }
        else if (maxSideLength < 1090) { // use 1120 * 840
            GameSettings.assetScale = GameSettings.AssetScales.medium;
            GameSettings.assetScaleTexturePrefix = GameSettings.TextureAssetScalePrefixes.medium;
        }
        else { // Use 1600 * 1200
            GameSettings.assetScale = GameSettings.AssetScales.large;
            GameSettings.assetScaleTexturePrefix = GameSettings.TextureAssetScalePrefixes.large;
        }

        console.log('===================== side='+maxSideLength+', scaleFactor='+GameSettings.assetScale);
    },

    determineDevice: function() {
        "use strict";
        // First, check if the game is running on desktop
        // "device.desktop" reports inaccurately on Internet Explorer, so we'll assume anyone using IE and not Windows Phone is on a desktop
        if (this.game.device.desktop || (this.game.device.ie && !this.game.device.windowsPhone)) {
            // Change assets to desktop versions
            GameSettings.currentDevice = GameSettings.Devices.Desktop;
        }
        // The only tablet we can detect accurately is the iPad
        // Otherwise, look at the window size and if it's greater than 800, then consider it a tablet
        else if (this.game.device.iPad || Math.min(window.innerWidth, window.innerHeight) > 800) {
            GameSettings.currentDevice = GameSettings.Devices.Tablet;
        }
        // We will assume everything else is a phone
        else {
            GameSettings.currentDevice = GameSettings.Devices.Phone;
        }
    },

    determinePlatform: function() {
        "use strict";
        // Determine if player is on Android or iOS
        if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) {
            GameSettings.currentPlatform = GameSettings.Platforms.iOS;
            GameSettings.hasRetinaDisplay = window.devicePixelRatio && window.devicePixelRatio > 1;
        } else if (navigator.userAgent.match(/Android/i)) {
            GameSettings.currentPlatform = GameSettings.Platforms.Android;
        }
    },

    determineBrowser: function() {
        "use strict";
        // Determine the player's browser information
        GameSettings.isWebKitBrowser = navigator.userAgent.match(/AppleWebKit/i);
        GameSettings.isChromeBrowser = navigator.userAgent.match(/\) Chrome/i);
        GameSettings.browserName = this.getBrowserName();
    },

    getBrowserName: function() {
        "use strict";
        var N = navigator.appName.toLowerCase(), ua = navigator.userAgent, tem;
        if (N === 'netscape' && ua.match(/trident/i) && ua.match(/rv:\d+/i)) { return 'msie'; }
        var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) { M[2] = tem[1]; }
        M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
        return M[0].toLowerCase();
    },

    determineCapability: function() {
        "use strict";
        // If we're running as a native app, then show ads and have in-app purchasing
        if (this.game.device.cocoonJSApp || this.game.device.cocoonJS) {
            GameSettings.allowPurchasing = true;
            GameSettings.allowInterstitialAds = true;
        }

        // Check if the device supports saving/loading to local storage
        if (!this.game.device.localStorage || (typeof(Storage)==="undefined") || !window.localStorage) {
            GameSettings.isLocalStorageEnabled = false;
        }

        // Check if the device supports WebGL
        if (!this.game.device.webGL || (this.game.renderer instanceof PIXI.CanvasRenderer)) {
            GameSettings.isWebGLEnabled = false;
        }
    },

    determineLanguage: function() {
        "use strict";
        LocalizationManager.init({ locale: ARK_game_arena_connector.getParam('locale','en-US') });
        ARK_gameJQ.each(ARK_gameJQ('*'), function(index, value){
            var text = ARK_gameJQ(value).text();
            if (LocalizationManager.getText(text) !== text){
                ARK_gameJQ(value).text(LocalizationManager.getText(text));
            }
        });
    },

    // ========================= Captures =========================
    addKeyCaptures: function() {
        "use strict";
        this.game.input.keyboard.start();
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
            Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.BACKSPACE, Phaser.Keyboard.DELETE,
            Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.INSERT,
            Phaser.Keyboard.HOME, Phaser.Keyboard.END,
            Phaser.Keyboard.PAGE_UP, Phaser.Keyboard.PAGE_DOWN,
            Phaser.Keyboard.EQUALS, Phaser.Keyboard.TAB
        ]);
    }
};