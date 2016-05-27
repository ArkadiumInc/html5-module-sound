/**
 * Created by jedi on 26-Feb-16.
 */

var GameSettings = require('./GameSettings');

var BaseDisplayObjectContainer = function (game)
{
    'use strict';
    this._isDestroyed = false;
    this._game = game;
    Phaser.Group.call(this, this._game, null);
};


// ========== Prototype =========
BaseDisplayObjectContainer.prototype = Object.create(Phaser.Group.prototype);
BaseDisplayObjectContainer.prototype.constructor = BaseDisplayObjectContainer;
module.exports = BaseDisplayObjectContainer;

BaseDisplayObjectContainer.prototype.initialize = function ()
{
    'use strict';
};

BaseDisplayObjectContainer.prototype.destroy = function (destroyChildren)
{
    'use strict';
    this._isDestroyed = true;
    Phaser.Group.prototype.destroy.call(this, destroyChildren);
};

BaseDisplayObjectContainer.prototype.mri = function (value)
{
    'use strict';
    return value * GameSettings.assetScale;
};

