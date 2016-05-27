/**
 * Created by davidor on 5/1/2015.
 */

// ========================= Construction =========================
/**
 * Manages loading and showing advertisements
 * @constructor
 */
var SoundManager = function () {
    'use strict';
};

SoundManager.instance = new SoundManager();

// ========================= Initialization =========================
SoundManager.prototype.init = function(game, maxChannelsPerSound) {
    'use strict';
    this.game = game;
    this.sounds = {};
    this.maxChannelsPerSound = maxChannelsPerSound;
};

// ========================= Sounds =========================
SoundManager.prototype.playSound = function(key, volume, loop, numChannels) {
    'use strict';
    // Set default values for parameters
    if (numChannels === undefined) { numChannels = this.maxChannelsPerSound; }

    // If sound already exists...
    if (this.sounds[key] != null) {
        // Check if this is a looping sound
        if (loop) {
            // If so, only play the sound if the previous looping sound isn't playing
            if (!this.sounds[key][0].isPlaying) {
                this.sounds[key][0].play();
            } else {
                this.sounds[key][0].volume = volume;
            }
        }
        // Otherwise, this isn't a looping sound
        else {
            // Check through array if any previously created sounds finished playing
            for (var i=0; i<this.sounds[key].length; ++i) {
                // If so, then replay that sound without creating a new one
                if (!this.sounds[key][i].isPlaying) {
                    this.sounds[key][i].play();
                    return; // Exit out after playing sound
                }
            }

            // If all previous sounds are still playing and we still have some channels open
            if (this.sounds[key].length < this.maxChannelsPerSound &&
                this.sounds[key].length < numChannels) {
                // Then play a new sound on top of the other ones
                var newSound = this.game.sound.play(key, volume, loop);
                if (loop) { newSound.onLoop.add(this.playLoopedSound, newSound); }
                this.sounds[key].push(newSound);
            }
        }
    }
    // Otherwise, sound doesn't exist, so create a new sound to play
    else {
        var newSound = this.game.sound.play(key, volume, loop);
        if (loop) { newSound.onLoop.add(this.playLoopedSound, newSound); }
        this.sounds[key] = [newSound];
    }
};

SoundManager.prototype.playLoopedSound = function(){
    'use strict';
    this.play();
};

SoundManager.prototype.stopSound = function(key) {
    'use strict';
    if (this.sounds[key] != null) {
        for (var i=0; i<this.sounds[key].length; ++i) {
            this.sounds[key][i].stop();
        }
    }
};

SoundManager.prototype.resumeSound = function(key) {
    'use strict';
    if (this.sounds[key] != null) {
        for (var i=0; i<this.sounds[key].length; ++i) {
            this.sounds[key][i].resume();
        }
    }
};

SoundManager.prototype.pauseSound = function(key) {
    'use strict';
    if (this.sounds[key] != null) {
        for (var i=0; i<this.sounds[key].length; ++i) {
            this.sounds[key][i].pause();
        }
    }
};

// ========================= Volume =========================
SoundManager.prototype.setSoundVolume = function(key, volume) {
    'use strict';
    if (this.sounds[key] != null) {
        for (var i=0; i<this.sounds[key].length; ++i) {
            this.sounds[key][i].volume = volume;
        }
    }
};

// ========================= Mute =========================
SoundManager.prototype.muteAllSounds = function(value) {
    'use strict';
    this.game.sound.mute = value;
};
