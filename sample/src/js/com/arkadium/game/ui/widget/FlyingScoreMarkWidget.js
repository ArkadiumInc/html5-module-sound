/**
 * Created by jedi on 11-Mar-16.
 */

var BaseDisplayObjectContainer = require('../../BaseDisplayObjectContainer');
var GameContextConstants = require('../../GameContextConstants');

var FlyingScoreMarkerWidget = function (game, markerText, fontName, fontSize)
{
    'use strict';
    BaseDisplayObjectContainer.call(this, game);
    this._markerText = markerText;
    this._fontName = fontName;
    this._fontSize = fontSize;
    this._txtMarker = null;
    this._tween = null;
};


// ========== Prototype =========
FlyingScoreMarkerWidget.prototype = Object.create(BaseDisplayObjectContainer.prototype);
FlyingScoreMarkerWidget.prototype.constructor = FlyingScoreMarkerWidget;
module.exports = FlyingScoreMarkerWidget;

FlyingScoreMarkerWidget.prototype.initialize = function () {
    'use strict';
    BaseDisplayObjectContainer.prototype.initialize.call(this);
    this._txtMarker = new Phaser.BitmapText(
        this._game,
        this.mri(0),
        this.mri(0),
        this._fontName,
        this._markerText,
        this._fontSize,
        'left'
    );
    this.addChild(this._txtMarker);
};

FlyingScoreMarkerWidget.prototype.show = function () {
    'use strict';
    this._tween = this._game.add.tween(this);
    this._tween.onComplete.add(this.handleFinishShowing, this);
    this._tween.to({ x : this.x, y : this.y - this.mri(40), alpha: 0}, 800, Phaser.Easing.Linear.None);
    this._tween.start();
};

FlyingScoreMarkerWidget.prototype.handleFinishShowing = function () {
    'use strict';
    this._game.tweens.remove(this._tween);
    this.parent.removeChild(this);
};

