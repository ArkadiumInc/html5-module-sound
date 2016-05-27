/**
 * Created by jedi on 24-Feb-16.
 */

var FSMModule = require('arkadium-fsm');
var FSMConfiguration = FSMModule.FSMConfiguration;
var FSMTransition = FSMModule.FSMTransition;

var InitState = require('./state/InitState');
var GameplayState = require('./state/GameplayState');
var PauseState = require('./state/PauseState');

var GameControllerFSMConfiguration = function(game, gameModel) {
    'use strict';
    FSMConfiguration.call(this);
    this._game = game;
    this._gameModel = gameModel;

    var params = {
        game : this._game,
        gameModel : this._gameModel
    };

    var initState = new InitState(params);
    var gameplayState = new GameplayState(params);
    var pauseState = new PauseState(params);

    this.addState(initState);
    this.addState(gameplayState);
    this.addState(pauseState);
    this.setInitialState(initState);

    var transition = new FSMTransition(initState, gameplayState);
    this.addTransition(transition);
    transition = new FSMTransition(gameplayState, pauseState);
    this.addTransition(transition);
    transition = new FSMTransition(pauseState, gameplayState);
    this.addTransition(transition);
    transition = new FSMTransition(gameplayState, gameplayState);
    this.addTransition(transition);
};

GameControllerFSMConfiguration.prototype = Object.create(FSMConfiguration.prototype);
GameControllerFSMConfiguration.prototype.constructor = GameControllerFSMConfiguration;

module.exports = GameControllerFSMConfiguration;