'use strict';
// Create the Phaser game
var PhaserPatch = require('./com/arkadium/phaser/PhaserPatch');

var PhaserGlobal = {stopFocus: true};
window.PhaserGlobal = {stopFocus: true};
var patch = new PhaserPatch();
patch.patch();


var gameWidth = (window.innerWidth > 0) ? window.innerWidth : 640;
var gameHeight = (window.innerHeight > 0) ? window.innerHeight : 480;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'templateGame', null); // jshint ignore:line

// Add all the state (aka scenes)
game.state.add('BootScene', require('./com/arkadium/game/scene/BootScene'));
game.state.add('PreloaderScene', require('./com/arkadium/game/scene/PreloaderScene'));
game.state.add('MenuScene', require('./com/arkadium/game/scene/MenuScene'));
game.state.start('BootScene');