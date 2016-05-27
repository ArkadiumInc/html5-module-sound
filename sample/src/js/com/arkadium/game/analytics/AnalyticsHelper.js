/**
 * Created by jedi on 27-Mar-16.
 */

var AnalyticsManager = require('../../core/analytics/amplitude/AnalyticsManager');
var AnalyticsConstants = require('./AnalyticsConstants');
var EventBusConstants = require('../../game/EventBusConstants');

var AnalyticsHelper = function (eventBus, screenOrientation, screenWidth, screenHeight)
{
    'use strict';
    this._gameplayStartTime = null;
    this._movesCounter = 0;
    this._screenOrientation = screenOrientation;
    this._screenWidth = screenWidth;
    this._screenHeight = screenHeight;

    this._am = new AnalyticsManager();
    this._eventBus = eventBus;

    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_SHOW_HELP_PANEL, this.handleHelpPanelShow, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_ORIENTATION_CHANGED, this.handleOrientationChange, this);

    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_START, this.handleGameStart, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_END, this.handleGameEnd, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_SCORE_CHANGED, this.handleScoreChanged, this);

};

AnalyticsHelper.prototype.constructor = AnalyticsHelper;
module.exports = AnalyticsHelper;

AnalyticsHelper.prototype.sendStartGameEvent = function() {
    'use strict';
    this._gameplayStartTime = new Date().getTime();
    this._am.logEvent(
        AnalyticsConstants.EVENT_NAMES.EVENT_GAMEPLAY_START,
        {
            screenOrientation : this._screenOrientation,
            screenWidth : this._screenWidth,
            screenHeight : this._screenHeight
        }
    );
};

AnalyticsHelper.prototype.sendGameEndEvent = function(score) {
    'use strict';
    var time = Math.round((new Date().getTime() - this._gameplayStartTime)/1000);
    this._am.logEvent(AnalyticsConstants.EVENT_NAMES.EVENT_GAMEPLAY_GAME_END, {duration : time, score : score});
};

AnalyticsHelper.prototype.sendFirstMoveEvent = function() {
    'use strict';
    var time = Math.round((new Date().getTime() - this._gameplayStartTime)/1000);
    this._am.logEvent(AnalyticsConstants.EVENT_NAMES.EVENT_GAMEPLAY_FIRST_MOVE, {delay : time});
};

AnalyticsHelper.prototype.sendMatchingEvent = function(score) {
    'use strict';
    this._am.logEvent(AnalyticsConstants.EVENT_NAMES.EVENT_GAMEPLAY_MATCHING, {score : score});
};

AnalyticsHelper.prototype.sendNewComboEvent = function(comboSize) {
    'use strict';
    this._am.logEvent(AnalyticsConstants.EVENT_NAMES.EVENT_GAMEPLAY_MATCHING, {comboSize : comboSize});
};

AnalyticsHelper.prototype.sendWrongPathEvent = function() {
    'use strict';
    this._am.logEvent(AnalyticsConstants.EVENT_NAMES.EVENT_GAMEPLAY_WRONG_DESTINATION_SELECTED);
};

AnalyticsHelper.prototype.sendOrientationChangedEvent = function(isPortrait) {
    'use strict';
    this._am.logEvent(AnalyticsConstants.EVENT_NAMES.EVENT_UI_ORIENTATION_CHANGED, {orientation : isPortrait ? 'portrait' : 'landscape'});
};

AnalyticsHelper.prototype.sendShowHelpEvent = function() {
    'use strict';
    var time = Math.round((new Date().getTime() - this._gameplayStartTime)/1000);
    this._am.logEvent(AnalyticsConstants.EVENT_NAMES.EVENT_UI_SHOW_HELP_PANEL, {timeFromStart : time});
};


AnalyticsHelper.prototype.handleHelpPanelShow = function() {
    'use strict';
    this.sendShowHelpEvent();
};

AnalyticsHelper.prototype.handleOrientationChange = function() {
    'use strict';
    this.sendOrientationChangedEvent();
};

AnalyticsHelper.prototype.handleGameStart = function() {
    'use strict';
    this.sendStartGameEvent();
};

AnalyticsHelper.prototype.handleGameEnd = function(score) {
    'use strict';
    this.sendGameEndEvent(score);
};

AnalyticsHelper.prototype.handleMovementFinished = function() {
    'use strict';
    this._movesCounter++;
    if(this._movesCounter === 1)
    this.sendFirstMoveEvent();
};

AnalyticsHelper.prototype.handleScoreChanged = function(score, scoreIncrement) {
    'use strict';
    this.sendMatchingEvent(scoreIncrement);
};

AnalyticsHelper.prototype.handleNewCombo = function(comboCounter) {
    'use strict';
    this.sendNewComboEvent(comboCounter);
};

AnalyticsHelper.prototype.handleWrongPath = function() {
    'use strict';
    this.sendWrongPathEvent();
};

AnalyticsHelper.prototype.destroy = function() {
    'use strict';
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_SHOW_HELP_PANEL, this.handleHelpPanelShow, this);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_ORIENTATION_CHANGED, this.handleOrientationChange, this);

    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_START, this.handleGameStart, this);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_END, this.handleGameEnd, this);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_SCORE_CHANGED, this.handleScoreChanged, this);

    this._gameplayStartTime = null;
    this._eventBus = null;
    this._movesCounter = 0;
    this._screenHeight = -1;
    this._screenWidth = -1;
    this._screenOrientation = null;
};
