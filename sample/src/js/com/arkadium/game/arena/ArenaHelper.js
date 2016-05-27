/**
 * Created by jedi on 28-Mar-16.
 */

var EventBusConstants = require('../../game/EventBusConstants');

var ArenaHelper = function (eventBus)
{
    'use strict';
    this._eventBus = eventBus;
    this._pauseHandler = this.handleMidrollStart.bind(this);
    this._resumeHandler = this.handleMidrollFinish.bind(this);

    ARK_game_arena_connector.registerAction('pause', this._pauseHandler);
    ARK_game_arena_connector.registerAction('resume', this._resumeHandler);

    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_BUTTON_PRESSED, this.handleButtonPress, this);

    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_START, this.handleGameStart, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_END, this.handleGameEnd, this);
    this._eventBus.addListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_REQUEST_MIDROLL, this.handleMidrollRequest, this);
};

ArenaHelper.prototype.constructor = ArenaHelper;
module.exports = ArenaHelper;


ArenaHelper.prototype.handleMidrollRequest = function() {
    'use strict';
    console.log('--- Midrol request');
    ARK_game_arena_connector.fireEventToArena('pause_ready');
};

ArenaHelper.prototype.handleMidrollStart = function() {
    'use strict';
    console.log('--- handle Midrol start');
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_MIDROLL_STARTED);
};

ArenaHelper.prototype.handleMidrollFinish = function() {
    'use strict';
    console.log('--- handle Midrol finish');
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_MIDROLL_FINISHED);
};

ArenaHelper.prototype.handleButtonPress = function() {
    'use strict';
    ARK_game_arena_connector.fireEventToArena('event_change');
};

ArenaHelper.prototype.handleCharacteSelected = function() {
    'use strict';
    ARK_game_arena_connector.fireEventToArena('event_change');
};

ArenaHelper.prototype.handleGameStart = function() {
    'use strict';
    ARK_game_arena_connector.fireEventToArena('game_start');
};

ArenaHelper.prototype.handleGameEnd = function(score) {
    'use strict';
    ARK_game_arena_connector.changeScore(score);
};

ArenaHelper.prototype.destroy = function() {
    'use strict';
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_SHOW_HELP_PANEL, this.handleButtonPress, this);

    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_START, this.handleGameStart, this);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_GAME_END, this.handleGameEnd, this);
    this._eventBus.removeListener(EventBusConstants.TOPIC_NAMES.GAMEPLAY, EventBusConstants.EVENT_NAMES.GAMEPLAY_REQUEST_MIDROLL, this.handleMidrollRequest, this);
};

