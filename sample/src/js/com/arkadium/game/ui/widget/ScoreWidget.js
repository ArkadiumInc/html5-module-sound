/**
 * Created by jedi on 25-Feb-16.
 */

var LevitatedButton = require('./LevitatedButton');
var GameContextConstants = require('../../GameContextConstants');
var ShowTransitionMovement = require('arkadium-panelmanager').ShowTransitionMovement;

var SoundConstants = require('../../SoundConstants');
var FontConstants = require('../../FontConstants');
var TextConstants = require('../../TextConstants');
var EventBusConstants = require('../../EventBusConstants');

var ScoreWidget = function (game)
{
    'use strict';
    this._game = game;
    LevitatedButton.call(this, this._game, 'scoreWidgetBackground');
    this.setClickSoundName(SoundConstants.SoundNames.SFX_SCORE_PLATFORM_CLICK);
    this._eventBus = this._game.gameContext[GameContextConstants.EntityNames.EventBus];
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_SCORE_CHANGED, this.handleScoreChanged, this);
};


// ========== Prototype =========
ScoreWidget.prototype = Object.create(LevitatedButton.prototype);
ScoreWidget.prototype.constructor = ScoreWidget;
module.exports = ScoreWidget;

ScoreWidget.prototype.initialize = function () {
    'use strict';

    //LevitatedPlatformWidget.prototype.initialize.call(this);
    //var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
    //var imgName = 'scoreWidgetBackground';
    //this._background = new Phaser.Image(this.game, 0, 0, tah.getAtlasFor(imgName), imgName);
    //this._backgroundLayer.addChild(this._background);

    LevitatedButton.prototype.initialize.call(this);
    this._txtScoreLabel = new Phaser.BitmapText(this._game, this.mri(0), this.mri(30), FontConstants.FontNames.FNT_UI, LocalizationManager.getText(TextConstants.TextIds.TXT_GAMEPLAY_UI_SCORE), 52, 'left');
    this._contentLayer.addChild(this._txtScoreLabel);
    this._txtScoreLabel.x = Math.ceil((this._backgroundLayer.width - this._txtScoreLabel.width) * 0.5);

    this._txtScore = new Phaser.BitmapText(this._game, this.mri(0), this.mri(65), FontConstants.FontNames.FNT_UI, '', 48, 'left');
    this.setScore('0');
    this._contentLayer.addChild(this._txtScore);
};

ScoreWidget.prototype.handleScoreChanged = function (score, scoreDelta) {
    'use strict';
    this.setScore(''+score);
};

ScoreWidget.prototype.setScore = function (score) {
    'use strict';
    this._score = score;
    this._txtScore.setText(this.formatScoreString(score));
    this._txtScore.x = Math.ceil((this._backgroundLayer.width - this._txtScore.width) * 0.5);
};

ScoreWidget.prototype.getScoreString = function () {
    'use strict';
    return this.formatScoreString(this._score);
};

ScoreWidget.prototype.createDownTransition = function () {
    'use strict';
    var moveTrans = new ShowTransitionMovement(
        this._game,
        this,
        this.x,
        this.y,
        this.x,
        this.y + this.mri(5),
        200,
        Phaser.Easing.Back.Out);

    return moveTrans;
};

ScoreWidget.prototype.createUpTransition = function () {
    'use strict';
    var moveTrans = new ShowTransitionMovement(
        this._game,
        this,
        this.x,
        this.y,
        this._initialX,
        this._initialY,
        200,
        Phaser.Easing.Back.Out);

    return moveTrans;
};

ScoreWidget.prototype.formatScoreString = function(scoreValue) {
    'use strict';
    return scoreValue.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

ScoreWidget.prototype.destroy = function(destroyChildren) {
    'use strict';
    if(this._isDestroyed) {
        return;
    }

    LevitatedButton.prototype.destroy.call(this, destroyChildren);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_SCORE_CHANGED, this.handleScoreChanged, this);
};