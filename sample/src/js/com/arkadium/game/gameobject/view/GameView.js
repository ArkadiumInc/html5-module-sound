/**
 * Created by JIocb on 2/8/2016.
 */
var BaseDisplayObjectContainer = require('../../BaseDisplayObjectContainer');
var GameContextConstants = require('../../GameContextConstants');
var SoundConstants = require('../../SoundConstants');
var TextConstants = require('../../TextConstants');
var FontConstants = require('../../FontConstants');
var SoundManager = require('../../../core/sound/SoundManager');
var GameSettings = require('../../GameSettings');
var ScoreWidget = require('../../ui/widget/ScoreWidget');
var LevitatedButton = require('../../ui/widget/LevitatedButton');
var LevitatedTriggerButton = require('../../ui/widget/LevitatedTriggerButton');
var EventBusConstants = require('../../EventBusConstants');
var HelpPanel = require('../../ui/panel/HelpPanel');
var GameEndPanel = require('../../ui/panel/GameEndPanel');

var GameView = function (game)
{
    'use strict';
    BaseDisplayObjectContainer.call(this, game);
    this._prevAspectRatio = this.defineAspectRatio();
    this._isDestroyed = false;

    this.BOARDVIEW_OFFSET_X_LANDSCAPE = this.mri(210);
    this.BOARDVIEW_OFFSET_Y_LANDSCAPE = this.mri(45);

    this._scale = 1;
    this._scaleBg = 1;
    this._isPortrait = false;
    this._boardView = null;
    this._backgroundLayer = new Phaser.Group(this._game, this);
    this._gameplayLayer = new Phaser.Group(this._game, this);
    this._uiLayer = new Phaser.Group(this._game, this);
    this._panelsLayer = new Phaser.Group(this._game, this);
    this._panelsLayer.pivot.x = 0.5;
    this._panelsLayer.pivot.y = 0.5;
    this._isMidrollStarted = false;
    this._needToPauseGameDuringMidroll = false;
    this._needToMuteSoundDuringMidroll = false;

    this._tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
    this._storableData = this._game.gameContext[GameContextConstants.EntityNames.StorableData];
    this._eventBus = this._game.gameContext[GameContextConstants.EntityNames.EventBus];

    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_HELP_PANEL_CLOSED, this.handleHelpPanelClose, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_CLOSE_HELP_PANEL, this.handleHelpPanelCloseRequest, this);

    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_GAMEEND_PANEL_CLOSED, this.handleGameEndPanelClose, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_CLOSE_GAMEEND_PANEL, this.handleGameEndPanelCloseRequest, this);

    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_END, this.handleGameEnd, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_SCORE_CHANGED, this.handleScoreChanged, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_MIDROLL_STARTED, this.handleMidrollStarted, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_MIDROLL_FINISHED, this.handleMidrollFinished, this);
};


// ========== Prototype =========
GameView.prototype = Object.create(BaseDisplayObjectContainer.prototype);
GameView.prototype.constructor = GameView;
module.exports = GameView;

//var BASE_WIDTH = 640;
//var BASE_HEIGHT = 480;

var ASPECT_RATIO_LANDSCAPE= 'landscape';
var ASPECT_RATIO_PORTRAIT = 'portrait';



GameView.prototype.initialize = function()
{
    'use strict';
    var imgName = 'background';
    this._background = new Phaser.Sprite(this._game, 0, 0, this._tah.getAtlasFor(imgName), imgName);
    //this._background.anchor.setTo(0.5, 0.5);
    this._bgHeight = this._background.height;
    this._bgWidth = this._background.width;
    this._backgroundLayer.addChild(this._background);

    this._scoreWidget = new ScoreWidget(this._game);
    this._scoreWidget.setShadow('platformShadow', this.mri(-10), this.mri(60));
    this._scoreWidget.initialize();
    this._scoreWidget.levitate(this.mri(100), this.mri(10), 1);
    this._uiLayer.addChild(this._scoreWidget);

    this._btnHelp = new LevitatedButton(this._game, 'buttonHelp', 'buttonHelpDown', 'buttonHelpDown', this.handleButtonHelpPressed, this);
    this._btnHelp.setShadow('buttonShadow', this.mri(-10), this.mri(60));
    this._btnHelp.initialize();
    this._btnHelp.x = this.mri(10);
    this._btnHelp.y = this.mri(140);
    this._btnHelp.levitate(this.mri(10), this.mri(100), 1);
    this._uiLayer.addChild(this._btnHelp);

    this._btnSound = new LevitatedTriggerButton(
        this._game,
        'buttonSoundOff',
        'buttonSoundOffDown',
        'buttonSoundOffDown',
        'buttonSoundOn',
        'buttonSoundOnDown',
        'buttonSoundOnDown',
        this.handleSoundButtonPress,
        this
    );
    this._btnSound.setShadow('buttonShadow', this.mri(-10), this.mri(60));
    this._btnSound.initialize();
    this._btnSound.x = this.mri(10);
    this._btnSound.y = this.mri(200);
    this._btnSound.levitate(this.mri(10), this.mri(200), 1);
    this._uiLayer.addChild(this._btnSound);
    this._btnSound.switchToState1(!this._storableData.isSoundMuted());

    this._btnScore = new LevitatedButton(
        this.game,
        'button_play_up',
        'button_play_down',
        'button_play_down',
        this.handleButtonAddScorePressed,
        this,
        FontConstants.FontNames.FNT_BUTTONS,
        50,
        LocalizationManager.getText(TextConstants.TextIds.TXT_GAMEPLAY_BUTTON_ADDSCORE),
        this.mri(-5),
        true
    );
    this._btnScore.initialize();
    this._btnScore.x = this.mri(10);
    this._btnScore.y = this.mri(100);
    this._uiLayer.addChild(this._btnScore);
    this._btnScore.levitate( this._btnScore.x, this._btnScore.y, 1);

    this._btnGameEnd = new LevitatedButton(
        this.game,
        'button_play_up',
        'button_play_down',
        'button_play_down',
        this.handleButtonGameEndPressed,
        this,
        FontConstants.FontNames.FNT_BUTTONS,
        50,
        LocalizationManager.getText(TextConstants.TextIds.TXT_GAMEPLAY_BUTTON_GAMEEND),
        this.mri(-5),
        true
    );
    this._btnGameEnd.initialize();
    this._uiLayer.addChild(this._btnGameEnd);
    this._btnGameEnd.levitate( 10, 10, 1);

    imgName = 'blackSquare32';
    this._scrim = new Phaser.Sprite(this._game, 0, 0, this._tah.getAtlasFor(imgName), imgName);
    this._scrim.inputEnabled = true;
    this._scrim.alpha = 0.6;
    this._scrim.visible = false;
    this._uiLayer.addChild(this._scrim);

    this.initPositions();
    this.resize();
};

GameView.prototype.handleButtonAddScorePressed = function (state) {
    'use strict';

    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_SCORE_CHANGED, 100500, 250);
};

GameView.prototype.handleButtonGameEndPressed = function (state) {
    'use strict';
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_END, 100500);
};

GameView.prototype.handleSoundButtonPress = function (state) {
    'use strict';
    if(state === 'state1') {
        SoundManager.instance.muteAllSounds(true);
    }
    else {
        SoundManager.instance.muteAllSounds(false);
    }
    this._storableData.setSoundMuted(state === 'state1');
    this._storableData.saveData();
};

GameView.prototype.handleHelpPanelCloseRequest = function () {
    'use strict';
    var pm = this._game.gameContext[GameContextConstants.EntityNames.PanelManager];
    pm.close(HelpPanel.NAME);
};

GameView.prototype.handleMidrollStarted = function () {
    'use strict';
    console.log('---  GV: Midroll started');
    this._isMidrollStarted = true;
    this._needToPauseGameDuringMidroll = !this._scrim.visible;
    if(this._needToPauseGameDuringMidroll) {
        console.log('---  GV: set scrim visible before Midroll');
        this.setScrimVisible(true);
        this.setInputLocked(true);
    }
    this._needToMuteSoundDuringMidroll = !this._game.sound.mute;
    if(this._needToMuteSoundDuringMidroll) {
        console.log('---  GV: mute sounds before Midroll');
        SoundManager.instance.muteAllSounds(true);
    }
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_PAUSE_GAME);
};

GameView.prototype.handleMidrollFinished = function () {
    'use strict';
    console.log('--- GV: Midroll finished');
    this._isMidrollStarted = false;
    if(this._needToMuteSoundDuringMidroll) {
        console.log('---  GV: unmute sounds after Midroll');
        SoundManager.instance.muteAllSounds(false);
        this._needToMuteSoundDuringMidroll = false;
    }
    if(this._needToPauseGameDuringMidroll) {
        console.log('---  GV: set scrim unvisible after Midroll');
        this.setScrimVisible(false);
        this.setInputLocked(false);
    }
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_RESUME_GAME);
};

GameView.prototype.handleScoreChanged = function () {
    'use strict';
};

GameView.prototype.handleGameEnd = function () {
    'use strict';
    SoundManager.instance.playSound(SoundConstants.SoundNames.SFX_GAMEEND);
    this.setScrimVisible(true);
    this.setInputLocked(true);
    var pm = this._game.gameContext[GameContextConstants.EntityNames.PanelManager];
    pm.open(GameEndPanel.NAME, {isPortraitMode : this._isPortrait, scaleFactor : this._scale, score : this._scoreWidget.getScoreString()});
};

GameView.prototype.handleGameEndPanelCloseRequest = function () {
    'use strict';
    var pm = this._game.gameContext[GameContextConstants.EntityNames.PanelManager];
    pm.close(GameEndPanel.NAME);
};

GameView.prototype.handleGameEndPanelClose = function () {
    'use strict';
    this.game.state.start('PreloaderScene');
};

GameView.prototype.setScrimVisible = function (state) {
    'use strict';

    this._scrim.visible = state;
    this._scrim.inputEnabled = state;
};


GameView.prototype.handleHelpPanelClose = function () {
    'use strict';
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_RESUME_GAME);
    this.setScrimVisible(false);
    this.setInputLocked(false);
};

GameView.prototype.handleButtonHelpPressed = function () {
    'use strict';
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_PAUSE_GAME);
    this.setScrimVisible(true);
    this.setInputLocked(true);
    var pm = this._game.gameContext[GameContextConstants.EntityNames.PanelManager];
    pm.open(HelpPanel.NAME, {isPortraitMode : this._isPortrait, scaleFactor : this._scale});
  };

GameView.prototype.setInputLocked = function (state) {
    'use strict';
    this._btnHelp.setInputLocked(state);
    this._btnSound.setInputLocked(state);
    this._boardView.setPausedState(state);
};

GameView.prototype.setBoardView = function(boardView)
{
    'use strict';
    if(boardView !== null && boardView !== this._boardView)
    {
        this._gameplayLayer.removeChild(boardView);
        this._gameplayLayer.addChild(boardView);
    }
    this._boardView = boardView;
    this.initBoardViewPosition();
    this.resize();

};

GameView.prototype.initBoardViewPosition = function()
{
    'use strict';

    this._boardView.x = this.BOARDVIEW_OFFSET_X_LANDSCAPE;
    this._boardView.y = this.BOARDVIEW_OFFSET_Y_LANDSCAPE;

};

GameView.prototype.getBoardView = function()
{
    'use strict';
    return this._boardView;
};


GameView.prototype.getPanelsLayer = function()
{
    'use strict';
    return this._panelsLayer;
};

GameView.prototype.getAspectRatio = function()
{
    'use strict';
    return this._aspectRatio;

};


GameView.prototype.defineAspectRatio = function() {
    'use strict';

    this._gameWidth = this._game.width;
    this._gameHeight = this._game.height;

    var coeff = 1.0;
    if(this._gameWidth*coeff<this._gameHeight)
    {
        GameSettings.BASE_HEIGHT = 640;
        GameSettings.BASE_WIDTH = 480;
        this._aspectRatio = ASPECT_RATIO_PORTRAIT;
        this._isPortrait = true;
    }
    else
    {
        GameSettings.BASE_HEIGHT = 480;
        GameSettings.BASE_WIDTH = 640;
        this._aspectRatio = ASPECT_RATIO_LANDSCAPE;
        this._isPortrait = false;
    }
    return this._aspectRatio;
};

GameView.prototype.sendOrientationChangedEvent = function() {
    'use strict';
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_ORIENTATION_CHANGED, this._isPortrait);
};

GameView.prototype.initPositions = function() {
    'use strict';
    if(this._isPortrait) {
        this.initPositionsPortrait();
    }
    else {
        this.initPositionsLandscape();
    }
};

GameView.prototype.onUpdate = function() {
    'use strict';

};

GameView.prototype.initPositionsLandscape = function() {
    'use strict';

    this._scoreWidget.x = this.mri(10);
    this._scoreWidget.y = this.mri(10);


    if(this._scoreWidget.isLevitated()) {
        this._scoreWidget.stopLevitation();
        this._scoreWidget.levitate(this._scoreWidget.x, this._scoreWidget.y);
    }

    this._btnScore.x = this._scoreWidget.x;
    this._btnScore.y = this._scoreWidget.getHeightWithoutShadow()+this.mri(10);

    if(this._btnScore.isLevitated()) {
        this._btnScore.stopLevitation();
        this._btnScore.levitate(this._btnScore.x, this._btnScore.y);
    }

    this._btnGameEnd.x = this._scoreWidget.x;
    this._btnGameEnd.y = this._btnScore.y + this._btnScore.getHeightWithoutShadow()+this.mri(5);

    if(this._btnGameEnd.isLevitated()) {
        this._btnGameEnd.stopLevitation();
        this._btnGameEnd.levitate(this._btnGameEnd.x, this._btnGameEnd.y);
    }

    var y = this._gameHeight - this._btnHelp.getHeightWithoutShadow() - this.mri(30) * this._scale;

    this._btnHelp.x = this._scoreWidget.x + this._scoreWidget.width * 0.5 - this._btnHelp.width - this.mri(10);
    this._btnHelp.y = y;

    if(this._btnHelp.isLevitated()) {
        this._btnHelp.stopLevitation();
        this._btnHelp.levitate(this._btnHelp.x, this._btnHelp.y);
    }

    this._btnSound.x = this._scoreWidget.x + this._scoreWidget.getWidthWithoutShadow() * 0.5 + this.mri(10);;
    this._btnSound.y = y;
};

GameView.prototype.initPositionsPortrait = function() {
    'use strict';

    this._scoreWidget.x = (this._game.width - this._scoreWidget.getWidthWithoutShadow()) * 0.5 - this.mri(10);
    this._scoreWidget.y = this.mri(10) * this._scale;


    if(this._scoreWidget.isLevitated()) {
        this._scoreWidget.stopLevitation();
        this._scoreWidget.levitate(this._scoreWidget.x, this._scoreWidget.y);
    }

    var y = this._scoreWidget.y + this._scoreWidget.getHeightWithoutShadow() + this.mri(20) * this._scale;
    this._btnHelp.x = this._scoreWidget.x - this._btnHelp.getWidthWithoutShadow() - this.mri(10) * this._scale;
    this._btnHelp.y = this._scoreWidget.y + this._scoreWidget.getHeightWithoutShadow() * 0.5 - this._btnHelp.getHeightWithoutShadow() * 0.5;

    if(this._btnHelp.isLevitated()) {
        this._btnHelp.stopLevitation();
        this._btnHelp.levitate(this._btnHelp.x, this._btnHelp.y);
    }

    this._btnScore.x = this.mri(10);
    this._btnScore.y = this._btnHelp.getHeightWithoutShadow()+this.mri(20);

    if(this._btnScore.isLevitated()) {
        this._btnScore.stopLevitation();
        this._btnScore.levitate(this._btnScore.x, this._btnScore.y);
    }

    this._btnGameEnd.x = this._game.width - this._btnGameEnd.getWidthWithoutShadow();
    this._btnGameEnd.y = this._btnScore.y;

    if(this._btnGameEnd.isLevitated()) {
        this._btnGameEnd.stopLevitation();
        this._btnGameEnd.levitate(this._btnGameEnd.x, this._btnGameEnd.y);
    }

    this._btnSound.x = this._scoreWidget.x + this._scoreWidget.getWidthWithoutShadow() + this.mri(10) * this._scale;
    this._btnSound.y = this._scoreWidget.y + this._scoreWidget.getHeightWithoutShadow() * 0.5 - this._btnSound.getHeightWithoutShadow()* 0.5;

    this._panelsLayer.x = this._game.width * 0.5;
    this._panelsLayer.y = this._game.height * 0.5;
};


GameView.prototype.resize = function() {
    'use strict';
    this.defineAspectRatio();
    if(this._prevAspectRatio !== this._aspectRatio)
    {
        this.sendOrientationChangedEvent();
    }
    this._prevAspectRatio = this._aspectRatio;

    var gameHeight = this._isPortrait ? this._gameWidth : this._gameHeight;

    this._scaleBg = Math.max(this._gameHeight/this._bgHeight, this._gameWidth/this._bgWidth);
    this._background.scale.x = this._scaleBg;
    this._background.scale.y = this._scaleBg;

    console.log('======== resize. gameWidth='+this._gameWidth+', gameHeight='+this._gameHeight+', scaleBg='+this._scaleBg);
    if(this._background !== null && this._background !== undefined) {
        if(this._isPortrait && this._background.rotation === 0) {
            this._background.anchor.setTo(0.5, 0.5);
            this._background.rotation = Math.PI / 2;
        }
        else if(!this._isPortrait && this._background.rotation !== 0) {
            this._background.rotation = 0;
            this._background.anchor.setTo(0, 0);
        }

        if(this._isPortrait) {
            this._background.x = this._gameWidth * 0.5;
            this._background.y = this._background.width * 0.5 - this.mri(30) * this._scaleBg;
        }
        else {
            this._background.x = 0;
            this._background.y = (this._gameHeight - this._background.height) * 0.5;
        }

        this._scale = Math.min(this._gameWidth/GameSettings.BASE_WIDTH,this._gameHeight/GameSettings.BASE_HEIGHT) / GameSettings.assetScale;

        var additionalScale = this._isPortrait ? 0.7 : 1;

        this._scoreWidget.scale.x = this._scale * additionalScale;
        this._scoreWidget.scale.y = this._scale * additionalScale;

        this._btnHelp.scale.x = this._scale;
        this._btnHelp.scale.y = this._scale;

        this._btnSound.scale.x = this._scale;
        this._btnSound.scale.y = this._scale;

        this._btnScore.scale.x = this._scale;
        this._btnScore.scale.y = this._scale;

        this._btnGameEnd.scale.x = this._scale;
        this._btnGameEnd.scale.y = this._scale;
    }

    if(this._boardView !== null)
    {
        this._boardScale = this._scale;
        this._boardView.scale.x = this._boardScale;
        this._boardView.scale.y = this._boardScale;
        var marginX = 0;
        var marginY = 0;
        if(this._isPortrait) {
            marginY = (this._game.height - this._scoreWidget.y - this._scoreWidget.getHeightWithoutShadow() - this._boardView.height) * 0.5;
            marginX = (this._game.width - this._boardView.width) * 0.5;
            this.BOARDVIEW_OFFSET_Y_LANDSCAPE = this._scoreWidget.y + this._scoreWidget.getHeightWithoutShadow() + marginY;
            this.BOARDVIEW_OFFSET_X_LANDSCAPE = marginX;
        }
        else {
            marginX = (this._game.width - this._scoreWidget.x - this._scoreWidget.getWidthWithoutShadow() - this._boardView.width) * 0.5;
            marginY = (this._game.height - this._boardView.height) * 0.5;
            this.BOARDVIEW_OFFSET_X_LANDSCAPE = this._scoreWidget.x + this._scoreWidget.getWidthWithoutShadow() + marginX;
            this.BOARDVIEW_OFFSET_Y_LANDSCAPE = marginY;
        }

        this._boardView.updatePositionAndScale();
        this.initBoardViewPosition();

        this._panelsLayer.scale.x = this._scale;// * additionalScale;
        this._panelsLayer.scale.y = this._scale;// * additionalScale;

        this._panelsLayer.x = this._game.width * 0.5;
        this._panelsLayer.y = this._game.height * 0.5;

        this._panelsLayer.pivot.x = 0.5;
        this._panelsLayer.pivot.y = 0.5;
    }

    this._scrim.width = this._game.width;
    this._scrim.height = this._game.height;

    this.initPositions();
};

GameView.prototype.destroy = function(destroyChildren) {
    if(this._isDestroyed) {
        return;
    }

    BaseDisplayObjectContainer.prototype.destroy.call(this, destroyChildren);

    this._prevAspectRatio = this.defineAspectRatio();

    this.removeChild(this._backgroundLayer);
    this.removeChild(this._gameplayLayer);
    this.removeChild(this._uiLayer);
    this.removeChild(this._panelsLayer);

    this._scoreWidget.destroy();
    this._scoreWidget = null;

    this._btnHelp.destroy();
    this._btnHelp = null;

    this._btnSound.destroy();
    this._btnSound = null;

    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_HELP_PANEL_CLOSED, this.handleHelpPanelClose, this);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_CLOSE_HELP_PANEL, this.handleHelpPanelCloseRequest, this);

    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_GAMEEND_PANEL_CLOSED, this.handleGameEndPanelClose, this);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_CLOSE_GAMEEND_PANEL, this.handleGameEndPanelCloseRequest, this);

    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_END, this.handleGameEnd, this);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_SCORE_CHANGED, this.handleScoreChanged, this);

};

