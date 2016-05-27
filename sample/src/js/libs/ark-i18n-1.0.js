if (typeof ARK_gameJQ === 'undefined' && typeof jQuery !== 'undefined') {
	ARK_gameJQ = $;
}

var LocalizationManager = (function () {
	"use strict";
	var _actualLocale = null;
	var _targetLocale = null;
	var _defaultLocale = null;
	var _localeChangedCallback = null;
	var _resourceLoader = null;
	var _defaultResourceLoader = null;
	var _initialized = false;
	var configuration = null;
	var _texts = null;
	var _DEFAULT_CONFIG_URL = 'localization.json';
	var _configURL = null;
	var _instance = null;
	var _gameURL = '';
	var _BASE_ASSETS_PATH = 'assets/';
	var _IMAGES_PATH = 'images';
	var _SOUNDS_PATH = 'sounds';
	var _STYLES_PATH = 'styles';
    var _JS_PATH = 'js';
	var _TEXTS_PATH = 'texts';
	var _TEXT_FILENAME_SUFFIX = '.txt';
	var _LANGUAGE_INVARIANT_RESOURCES_PATH = 'common';
	var _LOCALE_COUNTRY_SEPARATOR = '-';
	
	var _resourceLoader_jquery = function(resourceURL, callback) {
		ARK_gameJQ.ajax({
			url: resourceURL,
			async: false,
			cache: true,
			dataType: 'text',
			success: function(data, textStatus, jqXHR) {
				callback(true, data);
			},
			error: function(jqXHR, textStatus, errorDescription) {
				callback(false, errorDescription);
			}
		});
	};
	
	var _resourceLoader_preloadjs = function(resourceURL, callback) {
		var queue = new createjs.LoadQueue(false);
		queue.addEventListener("fileload", function(ev) {
			callback(true, ev.target.getResult(resourceURL, true));
		});
		queue.addEventListener("error", function(ev) {
			callback(false, 'Load error');
		});
		queue.loadFile(resourceURL);
	};

	function LocalizationManager() {
		_instance = this;
		// WARNING: The strange line below is not a junk! It is used during build procedure ("deploy") to inject "localization.json" file content here,
		// so don't remove it from this file until you completely understand that you are doing
		var configAsString = '$$$_localization_config_content_$$$';
		parseConfiguration(configAsString, true);
		detectDefaultResourceLoader();
		_configURL = _BASE_ASSETS_PATH + _DEFAULT_CONFIG_URL;
	}
	
	function parseConfiguration(configurationString, skipErrorReporting) {
		_instance.configuration = null;
		var _c = null;
		try {
			_c = JSON.parse(configurationString);
		} catch (parseError) {	
			if (skipErrorReporting !== true) {
				console.error('LocalizationManager.parseConfiguration: invalid JSON <' + configurationString + '>, original error message = ' + parseError.message);
				return false;
			}
		}
		if (_c) {
			var availLocales = _c['availableLocales'];
			if (availLocales == null) {
				console.error('LocalizationManager.parseConfiguration: no mandatory parameter "availableLocales", exiting!');
				return false;
			}
			if (!(typeof(availLocales) === 'object' && typeof(availLocales.length) === 'number') || availLocales.length < 1) {
				console.error('LocalizationManager.parseConfiguration: "availableLocales" parameter be an Array of Strings with at least one element, exiting!');
				return false;
			}
			var i;
			_instance.configuration = { availableLocales: availLocales, languageOnlyLocales: [],  localesWithCountry: [], localizedImages: [], localizedSounds: [], localizedStyles: [], localizedJs:[]};
			for (i = 0; i < availLocales.length; ++i) {
				if (_defaultLocale === null) {
					_defaultLocale = availLocales[i];
				}
				if (availLocales[i].indexOf(_LOCALE_COUNTRY_SEPARATOR) > 0) {
					_instance.configuration.localesWithCountry.push(availLocales[i]);
				} else {
					_instance.configuration.languageOnlyLocales.push(availLocales[i]);
				}
			}
			var localizedImages = _c['localizedImages'];
			if (typeof(localizedImages) === 'object' && typeof(localizedImages.length) === 'number') {
				for (i = 0; i < localizedImages.length; ++i) {
					_instance.configuration.localizedImages.push(localizedImages[i]);
				}
			}
			var localizedSounds = _c['localizedSounds'];
			if (typeof(localizedSounds) === 'object' && typeof(localizedSounds.length) === 'number') {
				for (i = 0; i < localizedSounds.length; ++i) {
					_instance.configuration.localizedSounds.push(localizedSounds[i]);
				}
			}
			var localizedStyles = _c['localizedStyles'];
			if (typeof(localizedStyles) === 'object' && typeof(localizedStyles.length) === 'number') {
				for (i = 0; i < localizedStyles.length; ++i) {
					_instance.configuration.localizedStyles.push(localizedStyles[i]);
				}
			}
            var localizedJs = _c['localizedJs'];
            if (typeof(localizedJs) === 'object' && typeof(localizedJs.length) === 'number') {
                for (i = 0; i < localizedJs.length; ++i) {
                    _instance.configuration.localizedJs.push(localizedJs[i]);
                }
            }
			return true;
			// TODO: parse "forced_locales" and "language_detection" params
		}
		return false;
	}
	
	function getTextFilename(locale) {
		var gUrl = _gameURL.length > 0 ? (_gameURL + '/') : _gameURL;
		return gUrl + _BASE_ASSETS_PATH + _TEXTS_PATH + '/' + locale + _TEXT_FILENAME_SUFFIX;
	}
	
	function detectDefaultResourceLoader() {
//		 if (typeof(createjs) !== 'undefined' && typeof(createjs.LoadQueue) !== 'undefined') {
//			_defaultResourceLoader = _resourceLoader_preloadjs;
//			//$debug
//			console.log('LocalizationManager.detectDefaultResourceLoader: PreloadJS has been detected');
//		} else
         if (typeof(ARK_gameJQ) !== 'undefined') {
             _defaultResourceLoader = _resourceLoader_jquery;
             //$debug
             console.log('LocalizationManager.detectDefaultResourceLoader: jQuery has been detected');
        }
	}
	
	function loadConfiguration(callback) {
		console.log('LocalizationManager.loadConfiguration: loading config file <' + _configURL + '>');
		_resourceLoader(_configURL, function(success, data) {
			if (success === true) {
				if (parseConfiguration(data) === true) {
					callback();
				}
			} else {
				console.error('LocalizationManager.loadConfiguration: unable to load config file <' + _configURL + '>, error = <' + data + '>, exiting.');
			}
		});
	}
	
	LocalizationManager.prototype.setResourceLoader = function(loader) {
		_resourceLoader = loader;
	};
	
	LocalizationManager.prototype.getResourceLoader = function() {
		return _resourceLoader;
	};

	LocalizationManager.prototype.getAvailableLocales = function() {
		return _instance.configuration.availableLocales;
	};
	
	LocalizationManager.prototype.getTargetLocale = function() {
		return _targetLocale;
	};
	
	LocalizationManager.prototype.getActualLocale = function() {
		return _actualLocale;
	};
	
	LocalizationManager.prototype.getDefaultLocale = function() {
		return _defaultLocale;
	};


	// options: {
	//	resourceLoader: (optional) Function which accepts two parameters: (resourceURL, callback). It should load JSON file from "resourceURL" location and call "callback" function
	//	localeChangedCallback: (optional) Function, called by LocalizationManager after each locale change
	//	locale: (mandatory) String, like 'en', 'ru' or 'en_GB'
	//	configFileURL: (optional) String, alternative location of "localization.json"
	//	gameURL: (optional) String, an HTTP URL path to the game root folder
	// }
	LocalizationManager.prototype.init = function(options) {
		if (_initialized) {
			console.error('LocalizationManager.init: LocalizationManager can be initialized only once, exiting.');
			return;
		}
		
		if (options == null || typeof(options) !== 'object') {
			options = {};
		}
		
		if (options.gameURL != null || typeof(options.gameURL) === 'string') {
			_gameURL = options.gameURL;
		}
		
		if (options.locale == null || typeof(options.locale) !== 'string') {
			options.locale = window.navigator.userLanguage || window.navigator.language;
		}
		
		if (options.localeChangedCallback != null && typeof(options.localeChangedCallback) === 'function') {
			_localeChangedCallback = options.localeChangedCallback;
		}
		
		if (options.resourceLoader != null && typeof(options.resourceLoader) === 'function') {
			_resourceLoader = options.resourceLoader;
		} else {
			if (_defaultResourceLoader == null) {
				console.error('LocalizationManager.init: no resourceLoader is available, exiting. Please include jQuery or PreloadJS or set another loader function in the options')
				return;
			}
			_resourceLoader = _defaultResourceLoader;
		}
		
		var init2phase = function() {
			_instance.setLocale(options.locale);
			_initialized = true;
		};
		
		if (options.configFileURL != null && typeof(options.configFileURL) === 'string') {
			_configURL = options.configFileURL;
			loadConfiguration(init2phase);
		} else if (_instance.configuration == null) { // no injected configuration
			loadConfiguration(init2phase);
		} else  {
			// config is here, instant init
			init2phase();
		}
	};

	LocalizationManager.prototype.setLocale = function(locale) {
		if (locale == null || typeof(locale) !== 'string') {
			console.log('LocalizationManager.setLocale: trying to set incorrect locale <' + locale + '>');
		}
		_actualLocale = null;
		_targetLocale = locale;
		var targetLocaleWithCountry = (locale.indexOf(_LOCALE_COUNTRY_SEPARATOR) > 0);
		 // check most specific locales in the first order
		var i;
		if (targetLocaleWithCountry === true) {
			for (i = 0; i < _instance.configuration.localesWithCountry.length; ++i) {
				if (_instance.configuration.localesWithCountry[i] === _targetLocale) {
					_actualLocale = _targetLocale;
					break;
				}
			}
			if (_actualLocale === null) {
				for (i = 0; i < _instance.configuration.languageOnlyLocales.length; ++i) {
					if (_targetLocale.indexOf(_instance.configuration.languageOnlyLocales[i]) === 0) {
						_actualLocale = _instance.configuration.languageOnlyLocales[i];
						break;
					}
				}
			}
		} else {
			for (i = 0; i < _instance.configuration.languageOnlyLocales.length; ++i) {
				if (_targetLocale === _instance.configuration.languageOnlyLocales[i]) {
					_actualLocale = _targetLocale;
					break;
				}
			}
			if (_actualLocale === null) {
				for (i = 0; i < _instance.configuration.localesWithCountry.length; ++i) {
					if (_instance.configuration.localesWithCountry[i].indexOf(_targetLocale) === 0) {
						_actualLocale = _instance.configuration.localesWithCountry[i];
						break;
					}
				}
			}
		}
		
		if (_actualLocale === null) {
			_actualLocale = _defaultLocale;
			console.log('LocalizationManager.setLocale: unable to set target locale <' + _targetLocale + '>, because there are no such localized resources!');
			console.log('LocalizationManager.setLocale: setting default locale <' + _actualLocale + '>');
		}
		
		_texts = {};
		var textsURL = getTextFilename(_actualLocale);
		_resourceLoader(textsURL, function(success, data) {
			if (success === true) {
				var key, value, textLine, separatorIndex;
				var textData = data.split('\n');
				for (var i = 0; i < textData.length; ++i) {
					textLine = textData[i].trim();
					if (textLine.indexOf(';') !==0) { // skip comment line
						separatorIndex = textLine.indexOf('=');
						if (separatorIndex === 0) {
							console.error('LocalizationManager.setLocale: no key, invalid localized text line <' + textLine + '>');
							continue;
						}
						if (separatorIndex !== -1) {
							key = textLine.substr(0, separatorIndex).trim();
							if (separatorIndex - 1 < textLine.length) {
								value = textLine.substr(separatorIndex+1, textLine.length - separatorIndex).trim();
							} else {
								value = ''; // empty line. It is weird, but valid.
								//$debug
								console.log('LocalizationManager.setLocale: empty value, possibly invalid localized text line <' + textLine + '>');
							}
							_texts[key] = value;
							//$debug
						} else {
							//$debug
							//console.log('LocalizationManager.setLocale: empty line');
						}
					}
				}
			} else {
				console.error('LocalizationManager.setLocale: can not load localized texts file <' + textsURL + '>, exiting.');
			}
			if (_localeChangedCallback !== null) {
				_localeChangedCallback(success);
			}
		});
	};

	LocalizationManager.prototype.getLocalizedImageBasePath = function(imageFilename) {
		var gUrl = _gameURL.length > 0 ? (_gameURL + '/') : _gameURL;
		return gUrl + _BASE_ASSETS_PATH + _IMAGES_PATH + '/' + _actualLocale + '/';
//		return gUrl + _BASE_ASSETS_PATH + _IMAGES_PATH + '/' + _LANGUAGE_INVARIANT_RESOURCES_PATH + '/';
	};
	
	LocalizationManager.prototype.getLocalizedImageName = function(imageFilename) {
		var imageBasePath = _instance.getLocalizedImageBasePath(imageFilename);
		return imageBasePath + imageFilename;
	};

	LocalizationManager.prototype.getLocalizedSoundBasePath = function(soundFilename) {
		for (var i = 0; i < _instance.configuration.localizedSounds.length; ++i) {
			if (soundFilename === _instance.configuration.localizedSounds[i]) {
				var gUrl = _gameURL.length > 0 ? (_gameURL + '/') : _gameURL;
				return gUrl + _BASE_ASSETS_PATH + _SOUNDS_PATH + '/' + _actualLocale + '/';
			}
		}
		var gUrl = _gameURL.length > 0 ? (_gameURL + '/') : _gameURL;
		return gUrl + _BASE_ASSETS_PATH + _SOUNDS_PATH + '/' + _LANGUAGE_INVARIANT_RESOURCES_PATH + '/';
	};
	
	LocalizationManager.prototype.getLocalizedSoundName = function(soundFilename) {
		var basePath = _instance.getLocalizedSoundBasePath(soundFilename);
		return basePath + soundFilename;
	};

	LocalizationManager.prototype.getLocalizedStyleBasePath = function(styleFilename) {
		for (var i = 0; i < _instance.configuration.localizedStyles.length; ++i) {
			if (styleFilename === _instance.configuration.localizedStyles[i]) {
				var gUrl = _gameURL.length > 0 ? (_gameURL + '/') : _gameURL;
				return gUrl + _BASE_ASSETS_PATH + _STYLES_PATH + '/' + _actualLocale + '/';
			}
		}
		var gUrl = _gameURL.length > 0 ? (_gameURL + '/') : _gameURL;
		return gUrl + _BASE_ASSETS_PATH + _STYLES_PATH + '/' + _LANGUAGE_INVARIANT_RESOURCES_PATH + '/';
	};
	
	LocalizationManager.prototype.getLocalizedStyleName = function(styleFilename) {
		var basePath = _instance.getLocalizedStyleBasePath(styleFilename);
		return basePath + styleFilename;
	};

    LocalizationManager.prototype.getLocalizedJsBasePath = function(jsFilename) {
        for (var i = 0; i < _instance.configuration.localizedJs.length; ++i) {
            if (jsFilename === _instance.configuration.localizedJs[i]) {
                var gUrl = _gameURL.length > 0 ? (_gameURL + '/') : _gameURL;
                return gUrl + _BASE_ASSETS_PATH + _JS_PATH + '/' + _actualLocale + '/';
            }
        }
        var gUrl = _gameURL.length > 0 ? (_gameURL + '/') : _gameURL;
        return gUrl + _BASE_ASSETS_PATH + _JS_PATH + '/' + _LANGUAGE_INVARIANT_RESOURCES_PATH + '/';
    };

    LocalizationManager.prototype.getLocalizedJsName = function(jsFilename) {
        var basePath = _instance.getLocalizedJsBasePath(jsFilename);
        return basePath + jsFilename;
    };

	LocalizationManager.prototype.getText = function(key) {
		var value = _texts[key];
		return (typeof(value) === 'string' ? value : key);
	};
	

	return new LocalizationManager();
})();