/**
 * Created by jedi on 29-Feb-16.
 */

/**
 * Created by jedi on 17-Feb-16.
 */

var BasePanel = require('./BasePanel');
var LevitatedButton = require('../widget/LevitatedButton');
var Checkbox = require('../widget/CheckboxWidget');

var EventBusConstants = require('../../EventBusConstants');
var FontConstants = require('../../FontConstants');
var GameContextConstants = require('../../GameContextConstants');
var TextConstants = require('../../TextConstants');
var GameSettings = require('../../GameSettings');

var HelpPanel = function (game, guiBuilder)
{
    'use strict';
    BasePanel.call(this, game, guiBuilder);
    this._name = HelpPanel.NAME;
    this._isClosed = false;
    this._btnClose = null;
    this._background = null;
    this._backgroundLayer = null;
    this._contentLayer = null;
    this._pages = [];
    this._currentPageIndex = -1;
    this._showGameVersionCounter = 0;
    this._storableData = this._game.gameContext[GameContextConstants.EntityNames.StorableData];
};

HelpPanel.NAME = 'HelpPanel';

// ========== Prototype =========
HelpPanel.prototype = Object.create(BasePanel.prototype);
HelpPanel.prototype.constructor = HelpPanel;
module.exports = HelpPanel;

HelpPanel.prototype.getName = function() {
    'use strict';
    return HelpPanel.NAME;
};

HelpPanel.prototype.build = function() {
    'use strict';

    if(this._backgroundLayer === null || this._backgroundLayer === undefined) {
        BasePanel.prototype.build.call(this);
        //this.scale.x = scale;
        //this.scale.y = scale;
        this._backgroundLayer = new Phaser.Group(this._game, this);
        this.addChild(this._backgroundLayer);
        this._contentLayer = new Phaser.Group(this._game, this);
        this.addChild(this._contentLayer);

        var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
        var imgName = 'helpPanelBackground';
        this._background = new Phaser.Image(this.game, 0, 0, tah.getAtlasFor(imgName), imgName);
        this._background.inputEnabled = true;
        this._background.events.onInputDown.add(this.handleInputDown, this);

        this._backgroundLayer.addChild(this._background);
        this._btnClose = new LevitatedButton(
            this._game,
            'button_play_up',
            'button_play_down',
            'button_play_down',
            this.handleButtonClosePressed,
            this,
            FontConstants.FontNames.FNT_BUTTONS,
            58,
            LocalizationManager.getText(TextConstants.TextIds.TXT_START_BUTTON_PLAY),
            this.mri(-5)
        );
        this._btnClose.initialize();
        this._btnClose.x = (this._background.width - this._btnClose.width) * 0.5;
        this._btnClose.y = this._background.height - this._btnClose.height + this.mri(-5);
        this._btnClose.setAnchorPosition(this._btnClose.x, this._btnClose.y, 1);
        this._backgroundLayer.addChild(this._btnClose);

        this._btnPrevPage = new LevitatedButton(this._game, 'btnPrevPage', 'btnPrevPageDown', 'btnPrevPageDown', this.handleButtonPrevPagePressed, this);
        this._btnPrevPage.initialize();
        this._btnPrevPage.x = this._btnClose.x - this._btnPrevPage.width - this.mri(-15);
        this._btnPrevPage.y = this._btnClose.y + (this._btnClose.height - this._btnPrevPage.height) * 0.5;
        this._btnPrevPage.setAnchorPosition(this._btnPrevPage.x, this._btnPrevPage.y, 1);
        this._btnPrevPage.setPressDownParameters(5, 50);
        this._backgroundLayer.addChild(this._btnPrevPage);

        this._btnNextPage = new LevitatedButton(this._game, 'btnNextPage', 'btnNextPageDown', 'btnNextPageDown', this.handleButtonNextPagePressed, this);
        this._btnNextPage.initialize();
        this._btnNextPage.x = this._btnClose.x + this._btnClose.width + this.mri(-15);
        this._btnNextPage.y = this._btnClose.y + (this._btnClose.height - this._btnNextPage.height) * 0.5;
        this._btnNextPage.setAnchorPosition(this._btnNextPage.x, this._btnNextPage.y, 1);
        this._btnNextPage.setPressDownParameters(5, 50);
        this._backgroundLayer.addChild(this._btnNextPage);

        this.setInitialPosition(-this._background.width * 0.5, -this._background.height * 0.5 - this.mri(40));

        this.createPage1();
        this.createPage2();
        this.createPage3();
        this.createPage4();

        this._storableData.loadData();
        this._cbShowOnStartup = new Checkbox(
            this._game,
            LocalizationManager.getText(TextConstants.TextIds.TXT_HELP_SHOW_ON_STARTUP),
            this.handleCheckboxCheck,
            this
        );
        this._cbShowOnStartup.initialize();
        this._cbShowOnStartup.setChecked(this._storableData.isHelpShownAtStartup());
        this._cbShowOnStartup.x = this._background.x + (this._background.width - this._cbShowOnStartup.width) * 0.5;
        this._cbShowOnStartup.y = this._background.y + this._background.height + this.mri(20);
        this._backgroundLayer.addChild(this._cbShowOnStartup);

    }
    this._currentPageIndex = 0;
    this.updatePageContent();
};


HelpPanel.prototype.handleInputDown = function() {
    'use strict';

    this._showGameVersionCounter++;
    if(this._showGameVersionCounter >= 5) {
        this._versionNumber.visible = !this._versionNumber.visible;
        this._showGameVersionCounter = 0;
    }
    else {
        this._versionNumber.visible = false;
    }
};

HelpPanel.prototype.handleCheckboxCheck = function(isChecked) {
    'use strict';

    this._storableData.setShowHelpAtStartup(isChecked);
    this._storableData.saveData();
};

HelpPanel.prototype.reset = function() {
    'use strict';
    BasePanel.prototype.reset.call(this);
    this._currentPageIndex = 0;

    for(var i = 0; i < this._pages.length; ++i) {
        var page = this._pages[i];
        page.visible = false;
    }
    this._pages[this._currentPageIndex].visible = true;
};

HelpPanel.prototype.updatePageContent = function() {
    'use strict';
    if(this._currentPageIndex === 0) {
        this._btnPrevPage.visible = false;
        this._btnNextPage.visible = true;
    }
    else if(this._currentPageIndex > 0 && this._currentPageIndex === this._pages.length - 1) {
        this._btnPrevPage.visible = true;
        this._btnNextPage.visible = false;
    }
    else {
        this._btnPrevPage.visible = true;
        this._btnNextPage.visible = true;
    }

    for(var i = 0; i < this._pages.length; ++i) {
        var page = this._pages[i];
        page.visible = i === this._currentPageIndex;
    }

};

HelpPanel.prototype.handleButtonPrevPagePressed = function() {
    'use strict';
    this._currentPageIndex--;
    this.updatePageContent();
};

HelpPanel.prototype.handleButtonNextPagePressed = function() {
    'use strict';
    this._currentPageIndex++;
    this.updatePageContent();
};

HelpPanel.prototype.handleButtonClosePressed = function() {
    'use strict';
    if(this._isClosed) {
        return;
    }
    this._isClosed = true;
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_CLOSE_HELP_PANEL);
};

HelpPanel.prototype.onShowed = function() {
    'use strict';
    this._background.inputEnabled = true;
    BasePanel.prototype.onShowed.call(this);
};


HelpPanel.prototype.onHided = function() {
    'use strict';
    this._background.inputEnabled = false;
    BasePanel.prototype.onHided.call(this);
    this._isClosed = false;
    this._eventBus.dispatchEvent(EventBusConstants.TOPIC_NAMES.UI, EventBusConstants.EVENT_NAMES.UI_HELP_PANEL_CLOSED);
};

HelpPanel.prototype.createPage1 = function() {
    'use strict';
    var page = new Phaser.Group(this._game, this);
    var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
    var imgName = 'Screenshot_1';
    var img = new Phaser.Image(this.game, 0, this.mri(150), tah.getAtlasFor(imgName), imgName);
    var x = this._background.width * 0.5 - img.width - this.mri(2);
    img.x = x;
    page.addChild(img);

    var x = img.x + img.width * 0.5 + this.mri(5);
    var y = img.y + img.height - this.mri(10);

    imgName = 'right';
    img = new Phaser.Image(this.game, x, y, tah.getAtlasFor(imgName), imgName);
    img.anchor.setTo(0.5, 0.5);
    page.addChild(img);

    imgName = 'Screenshot_2';
    img = new Phaser.Image(this.game, 0, this.mri(150), tah.getAtlasFor(imgName), imgName);
    var x = this._background.width * 0.5 + this.mri(2);
    img.x = x;
    page.addChild(img);

    x = img.x + img.width * 0.5 + this.mri(5);
    y = img.y + img.height - this.mri(10);

    imgName = 'wrong';
    img = new Phaser.Image(this.game, x, y, tah.getAtlasFor(imgName), imgName);
    img.anchor.setTo(0.5, 0.5);
    page.addChild(img);

    var t = LocalizationManager.getText(TextConstants.TextIds.TXT_HELP_PAGE1);
    t = t.replace(/_n_/g, '\n');

    var txt = new Phaser.BitmapText(this._game, 0, this.mri(55), FontConstants.FontNames.FNT_HELP, t, 70, 'center');
    txt.maxWidth = this._background.width * 0.81;
    txt.setBoundsSize(this._background.width * 0.81, this._background.height * 0.23);

    x = (this._background.width - txt.width) * 0.5;
    txt.x = x;
    this._contentLayer.addChild(txt);
    page.addChild(txt);

    txt = new Phaser.BitmapText(this._game, 0, 0, FontConstants.FontNames.FNT_HELP, 'v '+GameSettings.version, 40, 'left');
    txt.y = this._background.height - txt.height - this.mri(60);
    txt.x = this.mri(60);
    this._contentLayer.addChild(txt);
    page.addChild(txt);
    this._versionNumber = txt;
    this._versionNumber.visible = false;

    this._pages.push(page);
    this._contentLayer.addChild(page);
    page.visible = false;
};


HelpPanel.prototype.createPage2 = function() {
    'use strict';
    var page = new Phaser.Group(this._game, this);
    var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];
    var imgName = 'Screenshot_3';
    var img = new Phaser.Image(this.game, 0, this.mri(150), tah.getAtlasFor(imgName), imgName);
    var x = this._background.width * 0.5 - img.width - this.mri(2);
    img.x = x;
    page.addChild(img);

    imgName = 'Screenshot_4';
    img = new Phaser.Image(this.game, 0, this.mri(150), tah.getAtlasFor(imgName), imgName);
    var x = this._background.width * 0.5 + this.mri(2);
    img.x = x;
    page.addChild(img);

    var t = LocalizationManager.getText(TextConstants.TextIds.TXT_HELP_PAGE2);
    t = t.replace(/_n_/g, '\n');

    var txt = new Phaser.BitmapText(this._game, 0, this.mri(55), FontConstants.FontNames.FNT_HELP, t, 42, 'center');
    txt.maxWidth = this._background.width *.81;
    txt.setBoundsSize(this._background.width *.81,this._background.height *.23);

    x = (this._background.width - txt.width) * 0.5;
    txt.x = x;
    this._contentLayer.addChild(txt);
    page.addChild(txt);

    this._pages.push(page);
    this._contentLayer.addChild(page);
    page.visible = false;
};

HelpPanel.prototype.createPage3 = function() {
    'use strict';
    var page = new Phaser.Group(this._game, this);
    var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];

    var imgName = 'helpNextCharacters';
    var img = new Phaser.Image(this.game, 0, this.mri(120), tah.getAtlasFor(imgName), imgName);
    var x = (this._background.width - img.width) * 0.5;
    var y = img.y + img.height + this.mri(2);
    img.x = x;
    page.addChild(img);

    imgName = 'Screenshot_5';
    img = new Phaser.Image(this.game, 0, y, tah.getAtlasFor(imgName), imgName);
    x = this._background.width * 0.5 - img.width - this.mri(2);
    img.x = x;
    page.addChild(img);

    imgName = 'Screenshot_6';
    img = new Phaser.Image(this.game, 0, y, tah.getAtlasFor(imgName), imgName);
    var x = this._background.width * 0.5 + this.mri(2);
    img.x = x;
    page.addChild(img);

    var t = LocalizationManager.getText(TextConstants.TextIds.TXT_HELP_PAGE3);
    t = t.replace(/_n_/g, '\n');

    var txt = new Phaser.BitmapText(this._game, 0, this.mri(55), FontConstants.FontNames.FNT_HELP, t, 72, 'center');
    txt.maxWidth = this._background.width *.81;
    txt.setBoundsSize(this._background.width *.81,this._background.height *.15);
    x = (this._background.width - txt.width) * 0.5;
    txt.x = x;
    this._contentLayer.addChild(txt);
    page.addChild(txt);

    this._pages.push(page);
    this._contentLayer.addChild(page);
    page.visible = false;
};

HelpPanel.prototype.createPage4 = function() {
    'use strict';
    var page = new Phaser.Group(this._game, this);
    var tah = this._game.gameContext[GameContextConstants.EntityNames.TextureAtlasHelper];

    var imgName = 'Screenshot_7';
    var img = new Phaser.Image(this.game, 0, this.mri(100), tah.getAtlasFor(imgName), imgName);
    var x = (this._background.width - img.width) * 0.5;
    var y = img.y + img.height + this.mri(2);
    img.x = x;
    page.addChild(img);

    var t = LocalizationManager.getText(TextConstants.TextIds.TXT_HELP_PAGE4);
    t = t.replace(/_n_/g, '\n');

    var txt = new Phaser.BitmapText(this._game, 0, this.mri(55), FontConstants.FontNames.FNT_HELP, t, 72, 'center');
    txt.maxWidth = this._background.width *.81;
    txt.setBoundsSize(this._background.width *.81,this._background.height *.1);
    x = (this._background.width - txt.width) * 0.5;
    txt.x = x;
    this._contentLayer.addChild(txt);
    page.addChild(txt);

    this._pages.push(page);
    this._contentLayer.addChild(page);
    page.visible = false;

};

HelpPanel.prototype.resize = function(aspectRatio) {
    'use strict';

    BasePanel.prototype.resize.call(this, aspectRatio);

};


