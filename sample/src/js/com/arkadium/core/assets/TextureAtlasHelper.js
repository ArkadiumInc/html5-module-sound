/**
 * Created by jedi on 16-Feb-16.
 */

var TextureAtlasHelper = function(game)
{
    'use strict';
    this._game = game;
    this._atlases = [];
};

TextureAtlasHelper.constructor = TextureAtlasHelper;
module.exports = TextureAtlasHelper;

TextureAtlasHelper.prototype.registerAtlas = function(atlasKey, imageKey, jsonKey, format)
{
    'use strict';
    var idx = this.getAtlasIndex(atlasKey);
    if(idx < 0)
    {
        this._atlases.push(new TextureAtlasInfo(atlasKey, imageKey, jsonKey, format));
    }
    else
    {
        throw new Error('Duplication of Texture Atlas. key='+atlasKey);
    }
};

TextureAtlasHelper.prototype.unregisterAtlas = function(atlasKey)
{
    'use strict';
    var idx = this.getAtlasIndex(atlasKey);
    if(idx >= 0)
    {
        this._atlases.splice(idx, 1);
        return true;
    }
    return false;
};

TextureAtlasHelper.prototype.parseJson = function()
{
    'use strict';
    for(var i = 0; i < this._atlases.length; ++i)
    {
        var tai = this._atlases[i];
        var json = this._game.cache.getJSON(tai.getAtlasKey());
        tai.parseJson(json);
    }
};

TextureAtlasHelper.prototype.validate = function()
{
    'use strict';

    var allTextures = {};
    for(var i = 0; i < this._atlases.length; ++i)
    {
        var tai = this._atlases[i];
        var textures = tai.getTextures();
        for(var j = 0; j < textures.length; ++j)
        {
            var name = textures[j];
            var test = allTextures[name];
            if( test === undefined || test === null)
            {
                allTextures[name] = tai.getAtlasKey();
            }
            else
            {
                var message = 'Duplication of texture with name=' + name + ' in Atlases ' + tai.getAtlasKey() + ' and ' + test;
                throw new Error(message);
            }
        }
    }
};

TextureAtlasHelper.prototype.getAtlasFor = function(textureName)
{
    'use strict';
    for(var i = 0; i < this._atlases.length; ++i)
    {
        var tai = this._atlases[i];
        if(tai.hasTexture(textureName))
        {
            return tai.getAtlasKey();
        }
    }
    return null;
}

TextureAtlasHelper.prototype.getAtlasIndex = function(atlasKey)
{
    'use strict';
    for(var i = 0; i < this._atlases.length; ++i)
    {
        var tai = this._atlases[i];
        if(tai.getAtlasKey() === atlasKey)
        {
            return i;
        }
    }
    return -1;
};

var TextureAtlasInfo = function(atlasKey, imageKey, jsonKey, format)
{
    'use strict';
    this._atlasKey = atlasKey;
    this._imageKey = imageKey;
    this._jsonKey = jsonKey;
    this._format = format;
    this._textureNamesDict = {};
    this._textureNamesList = [];
};

TextureAtlasInfo.constructor = TextureAtlasInfo;

TextureAtlasInfo.prototype.getAtlasKey = function()
{
    'use strict';
    return this._atlasKey;
};

TextureAtlasInfo.prototype.getImageKey = function()
{
    'use strict';
    return this._imageKey;
};

TextureAtlasInfo.prototype.getJsonKey = function()
{
    'use strict';
    return this._jsonKey;
};

TextureAtlasInfo.prototype.getJsonKey = function()
{
    'use strict';
    return this._jsonKey;
};

TextureAtlasInfo.prototype.parseJson = function(jsonObj)
{
    'use strict';
    this._textureNamesDict = {};
    this._textureNamesList = [];
    var frames = jsonObj.frames;
    for(var i = 0; i < frames.length; ++i)
    {
        var name = frames[i].filename;
        this._textureNamesDict[name] = name;
        this._textureNamesList.push(name);
    }
};

TextureAtlasInfo.prototype.getTextures = function()
{
    'use strict';
    return this._textureNamesList;
};

TextureAtlasInfo.prototype.hasTexture = function(textureName)
{
    'use strict';
    var name = this._textureNamesDict[textureName];
    return name !== undefined && name !== null;
};
