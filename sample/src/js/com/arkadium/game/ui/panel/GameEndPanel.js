/**
 * Created by jedi on 02-Mar-16.
 */

/**
 * Created by jedi on 29-Feb-16.
 */

/**
 * Created by jedi on 17-Feb-16.
 */

var BasePanel = require('./BasePanel');
var LevitatedButton = require('../widget/LevitatedButton');

var EventBusConstants = require('../../EventBusConstants');
var GameContextConstants = require('../../GameContextConstants');
var FontConstants = require('../../FontConstants');
var TextConstants = require('../../TextConstants');

var GameEndPanel = function (game, guiBuilder)
{
    'use strict';
    BasePanel.call(this, game, guiBuilder);
    this._name = GameEndPanel.NAME;
    this._isClosed = false;
    this._btnClose = null;
    this._background = null;
    this._backgroundLayer = null;
    this._contentLayer = null;
};

GameEndPanel.NAME = 'GameEndPanel';

// ========== Prototype =========
GameEndPanel.prototype = Object.create(BasePanel.prototype);
GameEndPanel.prototype.constructor = GameEndPanel;
module.exports = GameEndPanel;

GameEndPanel.prototype.getName = function() {
    'use strict';
    return GameEndPanel.NAME;
};

GameEndPanel.prototype.build = function() {
    'use strict';
    if(this._backgroundLayer === null || this._backgroundLayer === undefined) {
        BasePanel.prototype.build.call(this);
        this._backgroundLayer = new Phaser.Group(this._game, this);
        this.addChild(this._backgroundLayer);
        this._contentLayer = new Phaser.Group(this._game, this);
        this.addChild(this._contentLayer);

        var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
        var imgName = 'helpPanelBackground';
        this.setInitialPosition(this.mri(80), this.mri(20));
        this._background = new Phaser.Image(this.game, 0, 0, tah.getAtlasFor(imgName), imgName);
        this._backgroundLayer.addChild(this._background);

        imgName = 'gameEndPanelInsideArea';
        this._scoreBack = new Phaser.Image(this.game, 0, 0, tah.getAtlasFor(imgName), imgName);
        this._scoreBack.x = (this._background.width - this._scoreBack.width) * 0.5;
        this._scoreBack.y = this.mri(160);
        this._backgroundLayer.addChild(this._scoreBack);

        this._txtCaption = new Phaser.BitmapText(
            this._game,
            this.mri(0),
            this.mri(70),
            FontConstants.FontNames.FNT_UI,
            LocalizationManager.getText(TextConstants.TextIds.TXT_GAMEEND_TITLE),
            90,
            'left'
        );
        this._txtCaption.x = (this._backgroundLayer.width - this._txtCaption.width) * 0.5;
        this._backgroundLayer.addChild(this._txtCaption);

        this._txtScoreLabel = new Phaser.BitmapText(
            this._game,
            this.mri(0),
            this._scoreBack.y + this.mri(20),
            FontConstants.FontNames.FNT_UI,
            LocalizationManager.getText(TextConstants.TextIds.TXT_GAMEEND_SCORE),
            70,
            'left'
        );
        this._txtScoreLabel.x = (this._backgroundLayer.width - this._txtScoreLabel.width) * 0.5;
        this._backgroundLayer.addChild(this._txtScoreLabel);

        this._txtScoreValue = new Phaser.BitmapText(
            this._game,
            this.mri(0),
            this._txtScoreLabel.y + this._txtScoreLabel.height + this.mri(10),
            FontConstants.FontNames.FNT_UI,
            this._data.score,
            78,
            'left'
        );
        this._txtScoreValue.x = (this._backgroundLayer.width - this._txtScoreValue.width) * 0.5;
        this._backgroundLayer.addChild(this._txtScoreValue);

        this._btnClose = new LevitatedButton(
            this._game,
            'buttonReplay',
            'buttonReplayDown',
            'buttonReplayDown',
            this.handleButtonClosePressed,
            this,
            FontConstants.FontNames.FNT_BUTTONS,
            50,
            LocalizationManager.getText(TextConstants.TextIds.TXT_GAMEEND_BUTTON_PLAY_AGAIN),
            this.mri(-5)
        );
        this._btnClose.initialize();
        this._btnClose.x = (this._background.width - this._btnClose.width) * 0.5;
        this._btnClose.y = this._background.height - this._btnClose.height + this.mri(-15);
        this._btnClose.setAnchorPosition(this._btnClose.x, this._btnClose.y, 1);
        this._backgroundLayer.addChild(this._btnClose);

        this.setInitialPosition(-this._background.width * 0.5, -this._background.height * 0.5);
    }
};

GameEndPanel.prototype.setScoreText = function(scoreText) {
    'use strict';
    this._txtScoreValue.setText(scoreText);
    this._txtScoreValue.x = (this._backgroundLayer.width - this._txtScoreValue.width) * 0.5;
};

GameEndPanel.prototype.handleButtonClosePressed = function() {
    'use strict';
    if(this._isClosed) {
        return;
    }
    this._isClosed = true;
    ARK_game_arena_connector.fireEventToArena('game_end');
    //this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_CLOSE_GAMEEND_PANEL);
};

GameEndPanel.prototype.onHided = function() {
    'use strict';
    BasePanel.prototype.onHided.call(this);
    this._isClosed = false;
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_GAMEEND_PANEL_CLOSED);
};



