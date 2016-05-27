/**
 * Created by jedi on 26-Mar-16.
 */

var StorableData = function(gameId)
{
    'use strict';
    this._gameId = gameId;
    this._data = {
        muteSound : false,
        showHelpAtStartup : true
    };
};

// ========== Prototype =========
StorableData.prototype.constructor = StorableData;
module.exports = StorableData;

StorableData.prototype.isSoundMuted = function () {
    'use strict';
    return this._data.muteSound;
};

StorableData.prototype.setSoundMuted = function (state) {
    'use strict';
     this._data.muteSound = state;
};

StorableData.prototype.isHelpShownAtStartup = function () {
    'use strict';
    return this._data.showHelpAtStartup;
};

StorableData.prototype.setShowHelpAtStartup = function (state) {
    'use strict';
    this._data.showHelpAtStartup = state;
};

StorableData.prototype.loadData = function ()
{
    'use strict';
    if(localStorage) {
        var loadedData = localStorage.getItem(this._gameId);
        if (loadedData !== null) {
            this._data = JSON.parse(loadedData);
        }
    }
};

StorableData.prototype.saveData = function ()
{
    'use strict';

    'use strict';
    if(localStorage) {
        try {
            localStorage.setItem(this._gameId, JSON.stringify(this._data));
        }
        catch(error) {
            console.log("StorableData.saveData()", error.message);
        }
    }

};
