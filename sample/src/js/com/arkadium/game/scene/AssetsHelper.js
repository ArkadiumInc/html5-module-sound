/**
 * Created by jedi on 12-Mar-16.
 */

var GameSettings = require('../GameSettings');

var AssetsHelper = function ()
{
    'use strict';
};


// ========== Prototype =========
module.exports = AssetsHelper;

AssetsHelper.getPathToTextureAsset = function(fileName)
{
    'use strict';
    return 'assets/images/'+GameSettings.assetScaleTexturePrefix+'/'+fileName;
};

AssetsHelper.getPathToSoundAsset = function(fileName)
{
    'use strict';
    return 'assets/sounds/'+fileName;
};

AssetsHelper.getPathToFontAsset = function(fileName)
{
    'use strict';
    return 'assets/images/'+GameSettings.assetScale+'x/fonts/'+fileName;
};
