var GameContextConstants = require('../../GameContextConstants');
var EventBusConstants = require('../../EventBusConstants');

var BoardModel = function(gameControler, eventBus) {
    'use strict';
    this._gameController = gameControler;
    this._score = 0;
    this._isGameOver = false;
    this._eventBus = eventBus;
    this._isPaused = true;
    this._isDestroyed = false;
};

BoardModel.prototype.initialize = function () {
    'use strict';

};


BoardModel.prototype.getPausedState = function () {
    'use strict';
    return this._isPaused;
};


BoardModel.prototype.setPausedState = function (state) {
    'use strict';
    this._isPaused = state;
};

BoardModel.prototype.getScore = function () {
    'use strict';
    return this._score;
};

BoardModel.prototype.getView = function () {
    'use strict';
    return this._view;
};

BoardModel.prototype.setView = function (view) {
    'use strict';
    this._view = view;
};

BoardModel.prototype.onUpdate = function () {
    'use strict';
    if(this._isPaused) {
        return;
    }

    if(this._view != null) {
        this._view.onUpdate();
    }
};


BoardModel.prototype.doGameEnd = function () {
    'use strict';
    console.log('--- Game over ---');
    this._isGameOver = true;
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_END, this._score);
};


BoardModel.prototype.destroy = function (listener) {
    'use strict';
    if(this._isDestroyed) {
        return;
    }

    this._isDestroyed = true;
};

BoardModel.prototype.constructor = BoardModel;

module.exports = BoardModel;