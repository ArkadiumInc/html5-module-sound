/**
 * Created by jedi on 19-Feb-16.
 */

var EVENT_NAMES = {
    GAMEPLAY_GAME_START : 'gp.gameStart',
    GAMEPLAY_SCORE_CHANGED : 'gp.scoreChanged',
    GAMEPLAY_PAUSE_GAME : 'gp.pauseGame',
    GAMEPLAY_RESUME_GAME : 'gp.resumeGame',
    GAMEPLAY_GAME_END : 'gp.gameEnd',
    GAMEPLAY_MIDROLL_STARTED : 'gp.midrollStarted',
    GAMEPLAY_MIDROLL_FINISHED : 'gp.midrollFinished',
    GAMEPLAY_REQUEST_MIDROLL : 'gp.requestMidroll',

    UI_BUTTON_PRESSED : 'ui.buttonPressed',
    UI_SHOW_HELP_PANEL : 'ui.showHelpPanel',
    UI_CLOSE_HELP_PANEL : 'ui.closeHelpPanel',
    UI_HELP_PANEL_CLOSED : 'ui.helpPanelClosed',
    UI_SHOW_GAMEEND_PANEL : 'ui.showGameEndPanel',
    UI_CLOSE_GAMEEND_PANEL : 'ui.closeGameEndPanel',
    UI_GAMEEND_PANEL_CLOSED : 'ui.gameEndPanelClosed',
    UI_ORIENTATION_CHANGED : 'ui.orientationChanged'

};

var TOPIC_NAMES = {
    GAMEPLAY: 'eventBus.topicGameplay',
    UI: 'eventBus.topicUI'
};

Object.freeze(EVENT_NAMES);
Object.freeze(TOPIC_NAMES);

module.exports = {EVENT_NAMES : EVENT_NAMES, TOPIC_NAMES : TOPIC_NAMES};

