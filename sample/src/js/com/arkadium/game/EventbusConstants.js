/**
 * Created by jedi on 19-Feb-16.
 */

var EVENT_NAMES = {
    UI_BUTTON_PRESSED : 'ui.buttonPressed',
    UI_ORIENTATION_CHANGED : 'ui.orientationChanged'
};

var TOPIC_NAMES = {
    GAMEPLAY: 'eventBus.topicGameplay',
    UI: 'eventBus.topicUI'
};

Object.freeze(EVENT_NAMES);
Object.freeze(TOPIC_NAMES);

module.exports = {EVENT_NAMES : EVENT_NAMES, TOPIC_NAMES : TOPIC_NAMES};

