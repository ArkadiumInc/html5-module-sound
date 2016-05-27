/**
 * Created by jedi on 29-Mar-16.
 */

var BaseDisplayObjectContainer = require('../../BaseDisplayObjectContainer');
var SoundConstants = require('../../SoundConstants');
var FontConstants = require('../../FontConstants');
var SoundManager = require('../../../core/sound/SoundManager');
var GameContextConstants = require('../../GameContextConstants');
var EventBusConstants = require('../../EventBusConstants');

var CheckboxWidget = function (game, text, onPressCallback, callbackContext)
{
    'use strict';
    BaseDisplayObjectContainer.call(this, game);
    this._eventBus = this._game.gameContext[GameContextConstants.EntityNames.EventBus];
    this._onPressCallback = onPressCallback;
    this._onPressCallbackContext = callbackContext;
    this._isInputLocked = false;
    this._clickSoundName = SoundConstants.SoundNames.SFX_BUTTON_CLICK;
    this._text = text;
    this._isChecked = true;
};


// ========== Prototype =========
CheckboxWidget.prototype = Object.create(BaseDisplayObjectContainer.prototype);
CheckboxWidget.prototype.constructor = CheckboxWidget;
module.exports = CheckboxWidget;

CheckboxWidget.prototype.initialize = function () {
    'use strict';

    BaseDisplayObjectContainer.prototype.initialize.call(this);
    var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
    var imageName = 'checkboxBg';
    this._background = new Phaser.Image(this.game, 0, 0, tah.getAtlasFor(imageName), imageName);
    this._background.inputEnabled = true;
    this._background.events.onInputDown.add(this.handleInputDown, this);
    this._background.anchor.setTo(0.5, 0.5);
    this.addChild(this._background);

    imageName = 'checkboxChecked';
    this._checkedMark = new Phaser.Image(this.game, 0, 0, tah.getAtlasFor(imageName), imageName);
    this._checkedMark.inputEnabled = true;
    this._checkedMark.events.onInputDown.add(this.handleInputDown, this);
    this._checkedMark.anchor.setTo(0.5, 0.5);
    this.addChild(this._checkedMark);

    if(this._text !== null && this._text !== undefined) {
        this._txtCaption = new Phaser.BitmapText(
            this._game,
            this.mri(0),
            this.mri(0),
            FontConstants.FontNames.FNT_HELP,
            this._text,
            34,
            'left'
        );
        this._txtCaption.x = this._background.width + this.mri(10);
        this._txtCaption.y = -1 * this._txtCaption.height * 0.5;
        this.addChild(this._txtCaption);
    }

};

CheckboxWidget.prototype.setSoundEnabled = function (enabled) {
    'use strict';
    this._isSoundEnabled = enabled;
};

CheckboxWidget.prototype.setClickSoundName = function (soundName) {
    'use strict';
    this._clickSoundName = soundName;
};

CheckboxWidget.prototype.setChecked = function (state) {
    'use strict';
    this._isChecked = state;
    this._checkedMark.visible = state;
};

CheckboxWidget.prototype.setInputLocked = function (state) {
    'use strict';
    this._isInputLocked = state;
};

CheckboxWidget.prototype.handleInputDown = function () {
    'use strict';
    if(this._isInputLocked)
    {
        return;
    }
    this._checkedMark.visible = !this._checkedMark.visible;
    this._isChecked =  this._checkedMark.visible;

    if (this._onPressCallback !== null && this._onPressCallback !== undefined) {
       this._onPressCallback.call(this._onPressCallbackContext || this, this._isChecked);
    }

    if(this._isSoundEnabled) {
        SoundManager.instance.playSound(this._clickSoundName);
    }
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_BUTTON_PRESSED, this._name);
};
