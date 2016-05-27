// ========================= Requirements =========================
var GameSettings = require('../GameSettings');
var GameContextConstants = require('../GameContextConstants');
var PreloadAnimation = require('./PreloadAnimation');
var TextureAtlasHelper = require('../../core/assets/TextureAtlasHelper');
//var EventBus = require('../../core/eventbus/EventBus');
var EventBus = require('arkadium-eventbus').EventBus;
var EventBusConstants = require('../EventBusConstants');
var StorableData = require('../StorableData');
var AssetsHelper = require('./AssetsHelper');

// ========================= Construction =========================
var PreloaderScene = function (game) {
    'use strict';
    this._isAssetLoadingDone = false;
    this._isPreloadAnimationDone = false;
};
module.exports = PreloaderScene;

// ========================= Prototype =========================
PreloaderScene.prototype = {
    // ========================= Preloading =========================
    preload: function () {
        'use strict';
        this.game.gameContext = {};
        this._tah = new TextureAtlasHelper(this.game);
        this.game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper] = this._tah;
        var storableData = new StorableData();
        storableData.loadData();
        this.game.gameContext[GameContextConstants.EntityNames.StorableData] = storableData;
        this._eventBus = new EventBus();
        this.game.gameContext[GameContextConstants.EntityNames.EventBus] = this._eventBus;

        this._eventBus.registerEvent(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_ORIENTATION_CHANGED);
        this._eventBus.registerEvent(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_BUTTON_PRESSED);

        // Initialize variables
        this.game.stage.setBackgroundColor(0xFFFFFF); // Set background color
        $('#preloaderGIF').addClass('visible');
        $('#templateGame').removeClass('visible');

        // Show preload animation
        if (GameSettings.showPreloadAnimation) {
            // Hide other elements for the preloader to show
            document.getElementById('preloaderGIF').style.visibility = 'hidden';
            var preloadAnimation = new PreloadAnimation();
            this.stage = new swiffy.Stage(document.getElementById('swiffyContainer'), preloadAnimation);
            this.stage.start();

            // Set a timeout for the animation
            var currentScene = this;
            setTimeout(function (){
                $('#swiffyContainer').removeClass('visible');
                $('#preloaderGIF').addClass('visible');
                $('#templateGame').removeClass('visible');
                currentScene._isPreloadAnimationDone = true;
                currentScene.stage.destroy();
                currentScene.checkIfLoadingIsDone();
            }, 5000);
        }
        // Otherwise, don't show the animated logo
        else {
            document.getElementById('preloaderGIF').style.visibility = 'hidden';
            $('#swiffyContainer').removeClass('visible');
        }

        this.load.image('loaderScreenBackground', AssetsHelper.getPathToTextureAsset('loaderScreen.png'));
        this.load.image('logo', AssetsHelper.getPathToTextureAsset('logo.png'));
        this.load.image('progressBar', AssetsHelper.getPathToTextureAsset('progressBar.png'));
        this.load.image('progressBarFrame', AssetsHelper.getPathToTextureAsset('progressBarFrame.png'));
    },

    // ========================= Creation =========================
    create: function () {
        'use strict';
        //this.game.add.plugin(new Phaser.Plugin.Debug(this));
        this._isAssetLoadingDone = true;
        $('#preloaderGIF').removeClass('visible');
        $('#templateGame').addClass('visible');
        this.checkIfLoadingIsDone();
    },

    checkIfLoadingIsDone: function() {
        'use strict';
        // If both asset loading and preload animation are done, go to the menu
        if (this._isAssetLoadingDone &&(!GameSettings.showPreloadAnimation ||(GameSettings.showPreloadAnimation && this._isPreloadAnimationDone) ) ) {
             this.game.state.start('MenuScene');
        }
    },

};