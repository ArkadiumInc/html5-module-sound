/**
 * Created by jedi on 27-Mar-16.
 */

var AnalyticsManager = function ()
{
    'use strict';
};

AnalyticsManager.prototype.constructor = AnalyticsManager;
module.exports = AnalyticsManager;

AnalyticsManager.prototype.logEvent = function(eventName, params)
{
    'use strict';
    amplitude.logEvent(eventName, params);
};

