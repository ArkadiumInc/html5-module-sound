/**
 * Created by jedi on 25-Feb-16.
 */

var BaseDisplayObjectContainer = require('../../BaseDisplayObjectContainer');
var GameContextConstants = require('../../GameContextConstants');

var LevitatedPlatformWidget = function (game)
{
    'use strict';
    this._isDestroyed = false;
    this._game = game;
    BaseDisplayObjectContainer.call(this, this._game);
    this._hasShadow = false;
    this._shadow = null;
    this._shadowLayer = null;
    this._shadowImageName = null;
    this._shadowOffsetX = 0;
    this._shadowOffsetY = 0;
    this._maxDelta = 1;
    this._isLevitated = false;
};


// ========== Prototype =========
LevitatedPlatformWidget.prototype = Object.create(BaseDisplayObjectContainer.prototype);
LevitatedPlatformWidget.prototype.constructor = LevitatedPlatformWidget;
module.exports = LevitatedPlatformWidget;

LevitatedPlatformWidget.prototype.initialize = function () {
    'use strict';

    this._shadowLayer = new Phaser.Group(this._game, this);
    this._backgroundLayer = new Phaser.Group(this._game, this);
    this._contentLayer = new Phaser.Group(this._game, this);

    this.addChild(this._shadowLayer);
    this.addChild(this._backgroundLayer);
    this.addChild(this._contentLayer);

    if(this._hasShadow) {
        var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
        this._shadow = new Phaser.Image(this.game, this._shadowOffsetX, this._shadowOffsetY, tah.getAtlasFor(this._shadowImageName), this._shadowImageName);
        this._shadowLayer.addChild(this._shadow);
    }

};

LevitatedPlatformWidget.prototype.update = function ()
{
    'use strict';
    this.x = this.x|0;
    this.y = this.y|0;
    BaseDisplayObjectContainer.prototype.update.call(this);
};

LevitatedPlatformWidget.prototype.getWidthWithoutShadow = function () {
    'use strict';
    return this._backgroundLayer.width * this.scale.x;
};

LevitatedPlatformWidget.prototype.getHeightWithoutShadow = function () {
    'use strict';
    return this._backgroundLayer.height * this.scale.y;
};

LevitatedPlatformWidget.prototype.setShadow = function (shadowImageName, shadowOffsetX, shadowOffsetY) {
    'use strict';
    this._hasShadow = true;
    this._shadowImageName = shadowImageName;
    this._shadowOffsetX = shadowOffsetX;
    this._shadowOffsetY = shadowOffsetY;
};

LevitatedPlatformWidget.prototype.setAnchorPosition = function (initialX, initialY, maxDelta) {
    'use strict';
    this._initialX = initialX;
    this._initialY = initialY;
    if(maxDelta !== undefined && maxDelta !== null) {
        this._maxDelta = maxDelta;
    }
};

LevitatedPlatformWidget.prototype.levitate = function (initialX, initialY, maxDelta) {
    'use strict';

    this.stopLevitation();

    this.setAnchorPosition(initialX, initialY, maxDelta);

    var signX = initialX <= this.x ? -1 : 1;
    var signY = initialY <= this.y ? -1 : 1;

    if(Math.random() < 0.5)
    {
        signX = 0;
    }

    if(Math.random() < 0.5)
    {
        signY = 0;
    }

    var dx = signX * Math.random() * this._maxDelta;
    var dy = signY * Math.random() * this._maxDelta;

    this._tween = this._game.add.tween(this);
    this._tween.onComplete.add(this.onFinishLevitation, this);
    this._tween.to({ x : this._initialX + dx, y : this._initialY + dy}, 2000, Phaser.Easing.Linear.None);
    this._tween.start();
    this._isLevitated = true;
};

LevitatedPlatformWidget.prototype.stopLevitation = function () {
    'use strict';
    if(this._tween)
    {
        this._tween.pause();
    }
    this._game.tweens.remove(this._tween);
    this._isLevitated = false;
};

LevitatedPlatformWidget.prototype.isLevitated = function () {
    'use strict';
    return this._isLevitated;
};

LevitatedPlatformWidget.prototype.continueLevitation = function () {
    'use strict';
    this.levitate(this._initialX, this._initialY, this._maxDelta);
};

LevitatedPlatformWidget.prototype.onFinishLevitation = function () {
    'use strict';
    this.levitate(this._initialX, this._initialY, this._maxDelta);
};

LevitatedPlatformWidget.prototype.destroy = function (destroyChildren) {
    'use strict';
    if(this._isDestroyed) {
        return;
    }
    BaseDisplayObjectContainer.prototype.destroy.call(this, destroyChildren);
    this.stopLevitation();
};