/**
 * Created by jedi on 24-Feb-16.
 */

var BaseState = require('./BaseState');

var GameplayState = function(data) {
    'use strict';
    BaseState.call(this, GameplayState.NAME, data);
};

GameplayState.prototype = Object.create(BaseState.prototype);
GameplayState.prototype.constructor = GameplayState;

GameplayState.NAME = 'gameController.fsm.state.gameplay';

GameplayState.prototype.enter = function () {
    'use strict';
    BaseState.prototype.enter.call(this);
    this._gameModel.resumeGame();
};

GameplayState.prototype.exit = function () {
    'use strict';
    BaseState.prototype.exit.call(this);
};

GameplayState.prototype.dispose = function () {
    'use strict';

    BaseState.prototype.dispose.call(this);
};

module.exports = GameplayState;