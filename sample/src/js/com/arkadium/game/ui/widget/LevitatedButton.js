/**
 * Created by jedi on 27-Feb-16.
 */

var LevitatedPlatformWidget = require('./LevitatedPlatformWidget');
var GameContextConstants = require('../../GameContextConstants');
var EventBusConstants = require('../../EventBusConstants');

var ShowTransitionMovement = require('arkadium-panelmanager').ShowTransitionMovement;
var SoundConstants = require('../../SoundConstants');
var SoundManager = require('arkadium-sound').SoundManager;

var LevitatedButton = function (game, textureNameNormal, textureNamePressed, textureNameOver, onPressCallback, callbackContext, fontName, fontSize, text, textYOffset, fireCallbackOnDownPosition)
{
    'use strict';
    LevitatedPlatformWidget.call(this, game);
    this._eventBus = this._game.gameContext[GameContextConstants.EntityNames.EventBus];
    this._textureNameNormal = textureNameNormal;
    this._textureNamePressed = textureNamePressed || textureNameNormal;
    this._textureNameOver = textureNameOver || textureNameNormal;
    this._onPressCallback = onPressCallback;
    this._onPressCallbackContext = callbackContext;
    this._fireCallbackOnDownPosition = fireCallbackOnDownPosition || false;
    this._isPressed = false;
    this._isInputLocked = false;
    this._isSoundEnabled = true;
    this._clickSoundName = SoundConstants.SoundNames.SFX_BUTTON_CLICK;
    this._text = text;
    this._textFontName = fontName;
    this._textFontSize = fontSize;
    this._textYOffset = textYOffset || 0;
    this._txtCaption = null;
    this._name = null;
};


// ========== Prototype =========
LevitatedButton.prototype = Object.create(LevitatedPlatformWidget.prototype);
LevitatedButton.prototype.constructor = LevitatedButton;
module.exports = LevitatedButton;

LevitatedButton.prototype.initialize = function () {
    'use strict';

    LevitatedPlatformWidget.prototype.initialize.call(this);
    var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
    this._textureNormal = new Phaser.Image(this.game, 0, 0, tah.getAtlasFor(this._textureNameNormal), this._textureNameNormal);
    this._textureNormal.inputEnabled = true;
    this._textureNormal.events.onInputOver.add(this.handleInputOver, this);
    this._textureNormal.events.onInputDown.add(this.handleInputDown, this);
    this._backgroundLayer.addChild(this._textureNormal);
    this._texturePressed = new Phaser.Image(this.game, 0, 0, tah.getAtlasFor(this._textureNamePressed), this._textureNamePressed);
    this._backgroundLayer.addChild(this._texturePressed);
    this._textureOver = new Phaser.Image(this.game, 0, 0, tah.getAtlasFor(this._textureNameOver), this._textureNameOver);
    this._textureOver.inputEnabled = true;
    this._textureOver.events.onInputDown.add(this.handleInputDown, this);
    this._textureOver.events.onInputOut.add(this.handleInputOut, this);
    this._backgroundLayer.addChild(this._textureOver);
    if(this._text !== null && this._text !== undefined) {
        this._txtCaption = new Phaser.BitmapText(
            this._game,
            this.mri(0),
            this.mri(0),
            this._textFontName,
            this._text,
            this._textFontSize,
            'left'
        );
        this._txtCaption.x = (this._backgroundLayer.width - this._txtCaption.width) * 0.5;
        this._txtCaption.y = (this._backgroundLayer.height - this._txtCaption.height) * 0.5 + this._textYOffset;
        this._backgroundLayer.addChild(this._txtCaption);
    }

    this._textureOver.visible = false;
    this._texturePressed.visible = false;
    this._isCallbackDisabled = false;
    this._pressDownTransitionDy = this.mri(10);
    this._pressDownTransitionTime = 200;
};

LevitatedButton.prototype.setName = function (name) {
    'use strict';
    this._name = name;
};

LevitatedButton.prototype.setSoundEnabled = function (enabled) {
    'use strict';
    this._isSoundEnabled = enabled;
};

LevitatedButton.prototype.setClickSoundName = function (soundName) {
    'use strict';
    this._clickSoundName = soundName;
};


LevitatedButton.prototype.setPressDownParameters = function (dy, timeInMsc) {
    'use strict';
    this._pressDownTransitionDy = dy;
    this._pressDownTransitionTime = timeInMsc;
};

LevitatedButton.prototype.setInputLocked = function (state) {
    'use strict';
    this._isInputLocked = state;
};

LevitatedButton.prototype.disableCallbackCall = function (state) {
    'use strict';
    this._isCallbackDisabled = state;
};

LevitatedButton.prototype.handleInputDown = function () {
    'use strict';
    if(this._isInputLocked || this._isPressed)
    {
        return;
    }
    this._isPressed = true;
    this._textureNormal.visible = false;
    this._textureOver.visible = false;
    this._texturePressed.visible = true;
    this.stopLevitation();
    if(!this._fireCallbackOnDownPosition) {
        if (!this._isCallbackDisabled && this._onPressCallback !== null && this._onPressCallback !== undefined) {
            this._onPressCallback.call(this._onPressCallbackContext || this);
        }
    }
    if(this._isSoundEnabled) {
        SoundManager.instance.playSound(this._clickSoundName);
    }
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_BUTTON_PRESSED, this._name);

    var moveTrans = this.createDownTransition();
    moveTrans.start(this.onFinishDownTransition, this);
};

LevitatedButton.prototype.handleInputOver = function () {
    'use strict';
    if(this._isInputLocked) {
        return;
    }

    if(this._textureNormal.visible) {
        this._textureNormal.visible = false;
        this._textureOver.visible = true;
        this._texturePressed.visible = false;
    }
};

LevitatedButton.prototype.handleInputOut = function () {
    'use strict';
    if(this._textureOver.visible) {
        this._textureNormal.visible = true;
        this._textureOver.visible = false;
        this._texturePressed.visible = false;
    }
};

LevitatedButton.prototype.onFinishDownTransition = function () {
    'use strict';
    var moveTrans = this.createUpTransition();
    if(this._fireCallbackOnDownPosition) {
        if (!this._isCallbackDisabled && this._onPressCallback !== null && this._onPressCallback !== undefined) {
            this._onPressCallback.call(this._onPressCallbackContext || this);
        }
    }

    moveTrans.start(this.onFinishUpTransition, this);
};

LevitatedButton.prototype.onFinishUpTransition = function () {
    'use strict';
    this.continueLevitation();
    this._textureNormal.visible = true;
    this._textureOver.visible = false;
    this._texturePressed.visible = false;
    this._isPressed = false;
};

LevitatedButton.prototype.createDownTransition = function () {
    'use strict';
    var moveTrans = new ShowTransitionMovement(
        this._game,
        this,
        this.x,
        this.y,
        this.x,
        this.y + this._pressDownTransitionDy,
        this._pressDownTransitionTime,
        Phaser.Easing.Back.Out);

    return moveTrans;
};

LevitatedButton.prototype.createUpTransition = function () {
    'use strict';
    var moveTrans = new ShowTransitionMovement(
        this._game,
        this,
        this.x,
        this.y,
        this._initialX,
        this._initialY,
        this._pressDownTransitionTime,
        Phaser.Easing.Back.Out);

    return moveTrans;
};