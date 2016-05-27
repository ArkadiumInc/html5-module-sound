/**
 * Created by jedi on 24-Mar-16.
 */

/**
 * Created by jedi on 23-Mar-16.
 */

/**
 * Created by jedi on 25-Feb-16.
 */

var BaseDisplayObjectContainer = require('../../BaseDisplayObjectContainer');
var GameContextConstants = require('../../GameContextConstants');

var LoaderBarWidget = function (game)
{
    'use strict';
    this._game = game;
    BaseDisplayObjectContainer.call(this, this._game);
};


// ========== Prototype =========
LoaderBarWidget.prototype = Object.create(BaseDisplayObjectContainer.prototype);
LoaderBarWidget.prototype.constructor = LoaderBarWidget;
module.exports = LoaderBarWidget;

LoaderBarWidget.prototype.initialize = function () {
    'use strict';
    this._progressBarFrame = new Phaser.Sprite(this.game, 0, 0, 'progressBarFrame');
    this.addChild(this._progressBarFrame);
    this._progressBar = new Phaser.Sprite(this.game, this.mri(1), this.mri(1), 'progressBar');
    this.addChild(this._progressBar);
    this._loadingProgress = 0;
};

LoaderBarWidget.prototype.setProgress = function (progress) {
    'use strict';
    this._loadingProgress = progress / 100;
    this._progressBar.scale.x = this._loadingProgress;
};


