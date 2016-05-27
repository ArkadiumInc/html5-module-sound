/**
 * Created by jedi on 24-Feb-16.
 */


var FSMState = require('arkadium-fsm').FSMState;

var BaseState = function(name, data) {
    'use strict';
    FSMState.call(this, name, data);
//    this.NAME = this._name;
    if(data !== null && data !== undefined) {
        this._game = data.game;
        this._gameModel = data.gameModel;
    }
};

BaseState.prototype = Object.create(FSMState.prototype);
BaseState.prototype.constructor = BaseState;

module.exports = BaseState;

