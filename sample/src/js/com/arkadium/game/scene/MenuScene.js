// ========================= Requirements =========================
var GameSettings = require('../GameSettings');
var GameContextConstants = require('../GameContextConstants');
var AssetsHelper = require('./AssetsHelper');
var SoundConstants = require('../SoundConstants');
var SoundModule = require('arkadium-sound');
var SoundManager = SoundModule.SoundManager;
var FontConstants = require('../FontConstants');
var TextConstants = require('../TextConstants');

var LevitatedButton = require('../ui/widget/LevitatedButton');
var LoaderBarWidget = require('../ui/widget/LoaderBarWidget');

// ========================= Construction =========================
var MenuScene = function ()
{
};
module.exports = MenuScene;

// ========================= Prototype =========================
MenuScene.prototype = {

    preload: function () {
        'use strict';

        this._tah = this.game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
        this._storableData = this.game.gameContext[GameContextConstants.EntityNames.StorableData];

        var atlasImageUrl = AssetsHelper.getPathToTextureAsset(GameSettings.popupAtlas+'.png');
        var atlasJsonUrl = AssetsHelper.getPathToTextureAsset(GameSettings.popupAtlas+'.json');
        this.load.atlas(GameSettings.popupAtlas, atlasImageUrl, atlasJsonUrl);
        this.load.json(GameSettings.popupAtlas, atlasJsonUrl);
        this._tah.unregisterAtlas(GameSettings.popupAtlas);
        this._tah.registerAtlas(GameSettings.popupAtlas, atlasImageUrl, atlasJsonUrl);

        this.load.bitmapFont(
            FontConstants.FontNames.FNT_BUTTONS,
            AssetsHelper.getPathToFontAsset('GrilledCheese_buttons.png'),
            AssetsHelper.getPathToFontAsset('GrilledCheese_buttons.fnt'),
            null,
            0,
            0
        );

        // Load audio
        if (GameSettings.allowSound) {
            this.load.audio(SoundConstants.SoundNames.MUSIC_BACKGROUND, AssetsHelper.getPathToSoundAsset('bgm_game.mp3'), true);
            this.load.audio(SoundConstants.SoundNames.SFX_BUTTON_CLICK, AssetsHelper.getPathToSoundAsset('sfx_buttonClicked.mp3'), true);
            this.load.audio(SoundConstants.SoundNames.SFX_GAMEEND, AssetsHelper.getPathToSoundAsset('bgm_gameOver.mp3'), true);

        }
        console.log('---SOUNDMANAGER='+SoundManager);
        SoundManager.instance.init(this.game, 3);

        this._loadingProgress = 0.01;
        this._background = new Phaser.Sprite(this.game, 0, 0, 'loaderScreenBackground');
        this.add.existing(this._background);

        this._logo = new Phaser.Sprite(this.game, 0, 0, 'logo');
        this.add.existing(this._logo);

        this._progressIndicator = new LoaderBarWidget(this.game);
        this._progressIndicator.initialize();
        this.add.existing(this._progressIndicator);

        this.resize();
    },

    loadUpdate: function() {
        'use strict';
        var percent = this.load.progress;
        this._progressIndicator.setProgress(this.load.progress);
    },

    create: function() {
        'use strict';
        this._progressIndicator.setProgress(100);
        this.validateLoadedResources();

        this._btnMusic = new LevitatedButton(
            this.game,
            'button_play_up',
            'button_play_down',
            'button_play_down',
            this.handleButtonMusicPressed,
            this,
            FontConstants.FontNames.FNT_BUTTONS,
            40,
            LocalizationManager.getText(TextConstants.TextIds.TXT_START_BUTTON_MUSIC),
            this.mri(-5),
            true
        );
        this._btnMusic.initialize();
        this.add.existing(this._btnMusic);

        this._btnSfx = new LevitatedButton(
            this.game,
            'button_play_up',
            'button_play_down',
            'button_play_down',
            this.handleButtonSfxPressed,
            this,
            FontConstants.FontNames.FNT_BUTTONS,
            40,
            LocalizationManager.getText(TextConstants.TextIds.TXT_START_BUTTON_SFX),
            this.mri(-5),
            true
        );
        this._btnSfx.initialize();
        this.add.existing(this._btnSfx);

        this._btnMute = new LevitatedButton(
            this.game,
            'button_play_up',
            'button_play_down',
            'button_play_down',
            this.handleButtonMutePressed,
            this,
            FontConstants.FontNames.FNT_BUTTONS,
            40,
            LocalizationManager.getText(TextConstants.TextIds.TXT_START_BUTTON_MUTE),
            this.mri(-5),
            true
        );
        this._btnMute.initialize();
        this.add.existing(this._btnMute);

        this._btnUnmute = new LevitatedButton(
            this.game,
            'button_play_up',
            'button_play_down',
            'button_play_down',
            this.handleButtonUnmutePressed,
            this,
            FontConstants.FontNames.FNT_BUTTONS,
            40,
            LocalizationManager.getText(TextConstants.TextIds.TXT_START_BUTTON_UNMUTE),
            this.mri(-5),
            true
        );
        this._btnUnmute.initialize();
        this.add.existing(this._btnUnmute);

        this._progressIndicator.visible = false;

        this.resize();
    },

    // ========================= Resize =========================
    resize: function() {
        'use strict';
        // Get dimensions
        GameSettings.screenWidth = this.game.scale.width;
        GameSettings.screenHeight = this.game.scale.height;

        var scale = Math.min(this.game.width/GameSettings.BASE_WIDTH,this.game.height/GameSettings.BASE_HEIGHT) / GameSettings.assetScale;

        this._background.width = this.game.scale.width;
        this._background.height = this.game.scale.height;

        this._logo.scale.x = scale;
        this._logo.scale.y = scale;
        this._logo.x = (this.game.width - this._logo.width) * 0.5;
        this._logo.y = (this.game.height - this._logo.height) * 0.5 - this.mri(50);

        if(this._btnMusic !== undefined && this._btnMusic !== null) {
            this._btnMusic.scale.x = scale;
            this._btnMusic.scale.y = scale;
            this._btnMusic.x = (this.game.width - this._btnMusic.width) * 0.5;
            this._btnMusic.y = this._logo.y + this._logo.height;
            this._btnMusic.stopLevitation();
            this._btnMusic.levitate(this._btnMusic.x, this._btnMusic.y, 1);
        }

        if(this._btnSfx !== undefined && this._btnSfx !== null) {
            this._btnSfx.scale.x = scale;
            this._btnSfx.scale.y = scale;
            this._btnSfx.x = this._btnMusic.x - this._btnSfx.width - this.mri(10);
            this._btnSfx.y = this._btnMusic.y;
            this._btnSfx.stopLevitation();
            this._btnSfx.levitate(this._btnSfx.x, this._btnSfx.y, 1);
        }

        if(this._btnMute !== undefined && this._btnMute !== null) {
            this._btnMute.scale.x = scale;
            this._btnMute.scale.y = scale;
            this._btnMute.x = this._btnMusic.x + this._btnMusic.width + this.mri(10);
            this._btnMute.y = this._btnMusic.y;
            this._btnMute.stopLevitation();
            this._btnMute.levitate(this._btnMute.x, this._btnMute.y, 1);
        }

        if(this._btnUnmute !== undefined && this._btnUnmute !== null) {
            this._btnUnmute.scale.x = scale;
            this._btnUnmute.scale.y = scale;
            this._btnUnmute.x = this._btnMute.x + this._btnMute.width + this.mri(10);
            this._btnUnmute.y = this._btnMusic.y;
            this._btnUnmute.stopLevitation();
            this._btnUnmute.levitate(this._btnUnmute.x, this._btnUnmute.y, 1);
        }

        this._progressIndicator.scale.x = scale;
        this._progressIndicator.scale.y = scale;
        this._progressIndicator.x = (this._background.width - this._progressIndicator.width) * 0.5;
        this._progressIndicator.y = this.game.height - this._progressIndicator.height - this.mri(50);
    },

    validateLoadedResources: function() {
        'use strict';
        this._tah.parseJson();
        this._tah.validate();
    },

    // ========================= Button Event =========================
    handleButtonMusicPressed : function() {
        'use strict';
        if(GameSettings.allowSound) {
            SoundManager.instance.playSound(SoundConstants.SoundNames.MUSIC_BACKGROUND, 1, true);
        }
    },

    handleButtonSfxPressed : function() {
        'use strict';
        if(GameSettings.allowSound) {
            SoundManager.instance.playSound(SoundConstants.SoundNames.SFX_GAMEEND, 1, false);
        }
    },

    handleButtonMutePressed : function() {
        'use strict';
        if(GameSettings.allowSound) {
            SoundManager.instance.muteAllSounds(true);
        }
    },

    handleButtonUnmutePressed : function() {
        'use strict';
        if(GameSettings.allowSound) {
            SoundManager.instance.muteAllSounds(false);
        }
    },

    mri: function(value) {
        'use strict';
        return value * GameSettings.assetScale;
    }
};
