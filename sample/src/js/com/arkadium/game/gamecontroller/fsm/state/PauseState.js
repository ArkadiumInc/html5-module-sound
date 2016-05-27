/**
 * Created by jedi on 01-Mar-16.
 */

var BaseState = require('./BaseState');

var PauseState = function(data) {
    'use strict';
    BaseState.call(this, PauseState.NAME, data);
};

PauseState.prototype = Object.create(BaseState.prototype);
PauseState.prototype.constructor = PauseState;

PauseState.NAME = 'gameController.fsm.state.pause';

PauseState.prototype.enter = function () {
    'use strict';
    BaseState.prototype.enter.call(this);
    this._gameModel.pauseGame();
};

PauseState.prototype.exit = function () {
    'use strict';
    BaseState.prototype.exit.call(this);
};

PauseState.prototype.dispose = function () {
    'use strict';

    BaseState.prototype.dispose.call(this);
};

module.exports = PauseState;