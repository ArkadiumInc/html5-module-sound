var GameSettings = require('../../GameSettings');
var Board = require('../model/BoardModel');
var BaseDisplayObjectContainer = require('../../BaseDisplayObjectContainer');
var SoundConstants = require('../../SoundConstants');
var FontConstants = require('../../FontConstants');
var SoundManager = require('../../../core/sound/SoundManager');
var FlyingScoreMarkWidget = require('../../ui/widget/FlyingScoreMarkWidget');

var GameContextConstants = require('../../GameContextConstants');
var EventBusConstants = require("../../EventBusConstants");

var BoardView = function(game, board) {
    'use strict';
    BaseDisplayObjectContainer.call(this, game);
    this._isDestroyed = false;
    this._board = board;
    this._isInputLocked = false;
    this._isPaused = true;

    this._eventBus = this._game.gameContext[GameContextConstants.EntityNames.EventBus];
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_SCORE_CHANGED, this.handleScoreChanged, this);
};

BoardView.prototype = Object.create(BaseDisplayObjectContainer.prototype);
BoardView.prototype.constructor = BoardView;

BoardView.prototype.initialize = function () {
    'use strict';
    this._backgroundLayer = new Phaser.Group(this._game, this);
    this._scoreMarkersLayer = new Phaser.Group(this._game, this);

    this.addChild(this._backgroundLayer);
    this.addChild(this._scoreMarkersLayer);

    var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
    var imgName = 'boardBackground';
    this._background = new Phaser.Sprite(this._game, 0, 0, tah.getAtlasFor(imgName), imgName);
    this._backgroundLayer.addChild(this._background);
};

BoardView.prototype.handleScoreChanged = function (scoreValue, scoreDelta)
{
    'use strict';
    console.log('------------test-----------');
    var scoreMark = new FlyingScoreMarkWidget(this._game, this.formatScoreString(scoreDelta), FontConstants.FontNames.FNT_UI, 46);
    this._scoreMarkersLayer.addChild(scoreMark);
    scoreMark.initialize();
    scoreMark.x = (this._background.width - scoreMark.width) * 0.5;
    scoreMark.y = (this._background.height - scoreMark.height) * 0.5;
    scoreMark.show();
};

BoardView.prototype.getPausedState = function () {
    'use strict';
    return this._isPaused;
};


BoardView.prototype.setPausedState = function (state) {
    'use strict';
    this._isPaused = state;
};


// ================ Updating Visuals ================
BoardView.prototype.updatePositionAndScale = function () {
    'use strict';
};


BoardView.prototype.onUpdate = function () {
    'use strict';

    if(this._isPaused) {
        return;
    }

};

BoardView.prototype.setInputLock = function (isInputLocked) {
    'use strict';
    this._isInputLocked = isInputLocked;
};

BoardView.prototype.destroy = function (destroyChildren) {
    'use strict';
    if(this._isDestroyed) {
        return;
    }

    BaseDisplayObjectContainer.prototype.destroy.call(this, destroyChildren);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_SCORE_CHANGED, this.handleScoreChanged, this);
};

BoardView.prototype.formatScoreString = function(scoreValue) {
    'use strict';
    return scoreValue.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
// ================ Export ================
module.exports = BoardView;


