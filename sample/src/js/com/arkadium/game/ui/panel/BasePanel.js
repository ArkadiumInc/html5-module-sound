/**
 * Created by jedi on 01-Mar-16.
 */
/**
 * Created by jedi on 17-Feb-16.
 */

var ShowTransition = require('arkadium-panelmanager').ShowTransitionMovement;
var HideTransition = require('arkadium-panelmanager').HideTransitionMovement;
var Panel = require('arkadium-panelmanager').Panel;
var GameContextConstants = require('../../GameContextConstants');
var EventBusConstants = require('../../EventBusConstants');
var GameSettings = require('../../GameSettings');

var BasePanel = function (game, guiBuilder)
{
    'use strict';
    Panel.call(this, game, guiBuilder);
    this._eventBus = this._game.gameContext[GameContextConstants.EntityNames.EventBus];
    this._initialX = 0;
    this._initialY = 0;
};

BasePanel.NAME = 'BasePanel';

// ========== Prototype =========
BasePanel.prototype = Object.create(Panel.prototype);
BasePanel.prototype.constructor = BasePanel;
module.exports = BasePanel;

BasePanel.prototype.getName = function() {
    'use strict';
    return _name;
};

BasePanel.prototype.setInitialPosition = function(x, y) {
    'use strict';
    this._initialX = x;
    this._initialY = y;
};

BasePanel.prototype.createShowTransition = function() {
    'use strict';
    var dy = this._game.height * 0.5 + this.height;
    return new ShowTransition(this._game, this, this._initialX, -dy, this._initialX, this._initialY, 1000, Phaser.Easing.Back.Out);
};

BasePanel.prototype.createHideTransition = function() {
    'use strict';
    var dy = this._game.height * 0.5 + this.height;
    console.log('--- dy='+dy);
    return new HideTransition(this._game, this, this.x, -dy, 800, Phaser.Easing.Back.In);
};

BasePanel.prototype.resize = function(aspectRatio) {
    'use strict';
    Panel.prototype.resize.call(this, aspectRatio);
};

BasePanel.prototype.mri = function (value)
{
    'use strict';
    return value * GameSettings.assetScale;
};

