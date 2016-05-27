/**
 * Created by jedi on 24-Feb-16.
 */

var BaseState = require('./BaseState');

var InitState = function(data) {
    'use strict';
    BaseState.call(this, InitState.NAME, data);
};

InitState.prototype = Object.create(BaseState.prototype);
InitState.prototype.constructor = InitState;

InitState.NAME = 'gameController.fsm.state.firstRun';

InitState.prototype.enter = function () {
    'use strict';
    BaseState.prototype.enter.call(this);
};

InitState.prototype.exit = function () {
    'use strict';
    BaseState.prototype.exit.call(this);
};

InitState.prototype.dispose = function () {
    'use strict';

    BaseState.prototype.dispose.call(this);
    this._game = null;
};

module.exports = InitState;