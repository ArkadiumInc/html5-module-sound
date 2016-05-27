/**
 * Created by jedi on 24-Feb-16.
 */

var FSMModule = require('arkadium-fsm');
var GameControllerFSMConfiguration = require('./fsm/GameControllerFSMConfiguration');
var AnalyticsHelper = require('../analytics/AnalyticsHelper');
var ArenaHelper = require('../arena/ArenaHelper');
var EventBusConstants = require('../EventBusConstants');
var GameContextConstants = require('../GameContextConstants');
var GameSettings = require('../GameSettings');

var GameplayState = require('./fsm/state/GameplayState');
var PauseState = require('./fsm/state/PauseState');

var GameController = function (game, gameModel)
{
    'use strict';
    this._game = game;
    this._gameModel = gameModel;
    this._isDestroyed = false;
    this._eventBus = this._game.gameContext[GameContextConstants.EntityNames.EventBus];
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_PAUSE_GAME, this.handleGamePause, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_RESUME_GAME, this.handleGameResume, this);

    var fsmConfig = new GameControllerFSMConfiguration(game, gameModel);
    var fsmFactory = new FSMModule.FSMFactory();
    this._fsm = fsmFactory.createFSM('gameController.fsm', fsmConfig);

    var orientation = GameSettings.screenWidth >= GameSettings.screenHeight ? 'landscape' : 'portrait';
    this._analyticsHelper = new AnalyticsHelper(this._eventBus, orientation, GameSettings.screenWidth, GameSettings.screenHeight);
    this._arenaHelper = new ArenaHelper(this._eventBus);
};

GameController.prototype = {
};

GameController.prototype.constructor = GameController;
module.exports = GameController;

GameController.prototype.initialize = function() {
    'use strict';
};

GameController.prototype.handleGamePause = function() {
    'use strict';
    console.log("---- HANDLE GAME PAUSE ----");
    this.pauseGame();
};

GameController.prototype.handleGameResume = function() {
    'use strict';
    console.log("---- HANDLE GAME RESUME ----");
    this.resumeGame();
};

GameController.prototype.startGame = function() {
    'use strict';
    this._fsm.goToState(GameplayState.NAME);
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_START);
};

GameController.prototype.pauseGame = function() {
    'use strict';
    this._fsm.goToState(PauseState.NAME);
};

GameController.prototype.resumeGame = function() {
    'use strict';
    this._fsm.goToState(GameplayState.NAME);
};

GameController.prototype.destroy = function() {
    'use strict';
    if(this._isDestroyed) {
        return;
    }
    this._isDestroyed = true;
    this._analyticsHelper.destroy();
    this._arenaHelper.destroy();
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_PAUSE_GAME, this.handleGamePause, this);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_RESUME_GAME, this.handleGameResume, this);
};
