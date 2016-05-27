/**
 * Created by jedi on 28-Feb-16.
 */

var LevitatedButton = require('./LevitatedButton');
var BaseDisplayObjectContainer = require('../../BaseDisplayObjectContainer');

var LevitatedTriggerButton = function (
    game,
    textureNameNormal1,
    textureNamePressed1,
    textureNameOver1,
    textureNameNormal2,
    textureNamePressed2,
    textureNameOver2,
    onPressCallback,
    callbackContext)
{
    'use strict';
    BaseDisplayObjectContainer.call(this, game);
    this._onPressCallback = onPressCallback;
    this._callbackContext = callbackContext;
    this._btnState1 = new LevitatedButton(game, textureNameNormal1, textureNamePressed1, textureNameOver1, this.handleState1Press, this);
    this.addChild(this._btnState1);
    this._btnState2 = new LevitatedButton(game, textureNameNormal2, textureNamePressed2, textureNameOver2, this.handleState2Press, this);
    this.addChild(this._btnState2);
    this._btnState2.visible = false;
    this._isInputLocked = false;
};


// ========== Prototype =========
LevitatedTriggerButton.prototype = Object.create(BaseDisplayObjectContainer.prototype);
LevitatedTriggerButton.prototype.constructor = LevitatedTriggerButton;
module.exports = LevitatedTriggerButton;

LevitatedTriggerButton.prototype.setShadow = function (shadowImageName, shadowOffsetX, shadowOffsetY) {
    this._btnState1.setShadow(shadowImageName, shadowOffsetX, shadowOffsetY);
    this._btnState2.setShadow(shadowImageName, shadowOffsetX, shadowOffsetY);
};

LevitatedTriggerButton.prototype.setSoundEnabled = function (enabled) {
    'use strict';
    this._btnState1.setSoundEnabled(enabled);
    this._btnState2.setSoundEnabled(enabled);
};

LevitatedTriggerButton.prototype.setInputLocked = function (state) {
    'use strict';
    this._isInputLocked = state;
    this._btnState1.setInputLocked(state);
    this._btnState2.setInputLocked(state);
};

LevitatedTriggerButton.prototype.getWidthWithoutShadow = function () {
    'use strict';
    var btn = this._btnState1.visible ? this._btnState1 : this._btnState2;
    return btn.getWidthWithoutShadow() * this.scale.x;
};

LevitatedTriggerButton.prototype.getHeightWithoutShadow = function () {
    'use strict';
    var btn = this._btnState1.visible ? this._btnState1 : this._btnState2;
    return btn.getHeightWithoutShadow() * this.scale.x;
};

LevitatedTriggerButton.prototype.handleState1Press = function () {
    'use strict';
    //if(!this._btnState1.visible) {
    //    return;
    //}
    //this._btnState1.visible = false;
    //this._btnState2.disableCallbackCall(true);
    //this._btnState2.handleInputDown();
    //this._btnState2.disableCallbackCall(false);
    //this._btnState2.visible = true;
    //if(this._onPressCallback != undefined && this._onPressCallback != null) {
    //    this._onPressCallback.call(this._callbackContext, 'state1');
    //}

    this._btnState2.disableCallbackCall(true);
    this._btnState2.handleInputDown();
    this._btnState2.disableCallbackCall(false);

    this.switchToState1(false);
};

LevitatedTriggerButton.prototype.handleState2Press = function () {
    'use strict';
    //if(!this._btnState2.visible) {
    //    return;
    //}
    //this._btnState2.visible = false;
    //this._btnState1.disableCallbackCall(true);
    //this._btnState1.handleInputDown();
    //this._btnState1.disableCallbackCall(false);
    //this._btnState1.visible = true;
    //if(this._onPressCallback != undefined && this._onPressCallback != null) {
    //    this._onPressCallback.call(this._callbackContext, 'state2');
    //}

    this._btnState1.disableCallbackCall(true);
    this._btnState1.handleInputDown();
    this._btnState1.disableCallbackCall(false);

    this.switchToState1(true);
};

LevitatedTriggerButton.prototype.switchToState1 = function (state) {
    'use strict';
    if(state) {
        if(!this._btnState2.visible) {
            return;
        }
        this._btnState2.visible = false;
        this._btnState1.visible = true;
        if(this._onPressCallback !== undefined && this._onPressCallback !== null) {
            this._onPressCallback.call(this._callbackContext, 'state2');
        }

    }
    else {
        if(!this._btnState1.visible) {
            return;
        }
        this._btnState1.visible = false;
        this._btnState2.visible = true;
        if(this._onPressCallback !== undefined && this._onPressCallback !== null) {
            this._onPressCallback.call(this._callbackContext, 'state1');
        }
    }

};


LevitatedTriggerButton.prototype.initialize = function () {
    'use strict';
    this._btnState1.initialize();
    this._btnState2.initialize();
};

LevitatedTriggerButton.prototype.levitate = function () {
    'use strict';
    this._btnState1.initialize();
    this._btnState2.initialize();
};

LevitatedTriggerButton.prototype.levitate = function (initialX, initialY, maxDelta) {
    'use strict';
    this._btnState1.levitate(this._btnState1.x, this._btnState1.y, maxDelta);
    this._btnState2.levitate(this._btnState2.x, this._btnState2.y, maxDelta);

};

LevitatedTriggerButton.prototype.stopLevitation = function () {
    'use strict';
    this._btnState1.stopLevitation();
    this._btnState2.stopLevitation();
};

LevitatedTriggerButton.prototype.continueLevitation = function () {
    'use strict';
    this._btnState1.continueLevitation();
    this._btnState2.continueLevitation();
};

LevitatedTriggerButton.prototype.destroy = function (destroyChildren) {
    'use strict';
    if(this._isDestroyed) {
        return;
    }

    BaseDisplayObjectContainer.prototype.destroy.call(this, destroyChildren);
    this._btnState1.destroy(destroyChildren);
    this._btnState1 = null;
    this._btnState2.destroy(destroyChildren);
    this._btnState2 = null;
};
