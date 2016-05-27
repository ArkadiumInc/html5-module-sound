/**
 * Created by jedi on 17-Feb-16.
 */
var Board = require('./BoardModel');
var BoardView = require('./../view/BoardView');
var GameController = require('./../../gamecontroller/GameController');
var EventBusConstants = require("../../EventBusConstants");
var GameContextConstants = require('../../GameContextConstants');

var GameModel = function (game, view)
{
    'use strict';
    this._game = game;
    this._view = view;
    this._isDestroyed = false;
    this._board = null;
    this._gameController = null;
    this._eventBus = game.gameContext[GameContextConstants.EntityNames.EventBus];
};

GameModel.prototype.constructor = GameModel;
module.exports = GameModel;

GameModel.prototype.getView = function()
{
    'use strict';
    return this._view;
};

GameModel.prototype.initialize = function()
{
    'use strict';

    this._board = new Board(this, this._eventBus);
    this._board.initialize();
    this._boardView = new BoardView(this._game, this._board);
    this._boardView.initialize();
    this._view.setBoardView(this._boardView);
    this._board.setView(this._boardView);
    this._board.setPausedState(false);
    this._boardView.setPausedState(false);
    this._gameController = new GameController(this._game, this);
    this._gameController.initialize();
}

GameModel.prototype.startGame = function()
{
    'use strict';
    this._gameController.startGame();
    this.onBoardDataUpdate();
}

GameModel.prototype.pauseGame = function()
{
    'use strict';
    this._board.setPausedState(true);
    this._boardView.setPausedState(true);
}

GameModel.prototype.resumeGame = function()
{
    'use strict';
    this._board.setPausedState(false);
    this._boardView.setPausedState(false);
}

GameModel.prototype.onBoardDataUpdate = function () {
    'use strict';
    console.log('--- on Board Data update ---');
    //if(this._scorePanel != undefined) {
    //    this._scorePanel.updateBoardInfo(this._board.getNextTiles(), this._board.getScore());
    //}
};

GameModel.prototype.onUpdate = function () {
    'use strict';
    if(this._board !== null) {
        this._board.onUpdate();
    }
    if(this._view !== null) {
        this._view.onUpdate();
    }

};

GameModel.prototype.destroy = function () {
    'use strict';
    if(this._isDestroyed) {
        return;
    }

    this._isDestroyed = true;
    if(this._board !== null) {
        this._board.destroy();
        this._board = null;
    }

    if(this._view !== null) {
        this._view.destroy(true);
        this._view = null;
    }

    if(this._gameController !== null) {
        this._gameController.destroy();
        this._gameController = null;
    }
};
