/**
 * Created by jedi on 09-Mar-16.
 */

var SoundConstants = function()
{
};

SoundConstants.SoundNames = {
    MUSIC_BACKGROUND: 'bg_music',
    SFX_GAMEEND: 'sfx_gameEnd',
    SFX_BUTTON_CLICK: 'sfx_btnClick'
};

Object.freeze(SoundConstants.SoundNames);

module.exports = SoundConstants;
