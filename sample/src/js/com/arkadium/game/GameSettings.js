// ========================= Construction =========================
var GameSettings = {
    // Variables (manually set)
    gameId: "_PLACE_YOUR_GAME_UNIQUE_NAME_OR_ID_HERE_",
    version: "1.0.10",
    DEBUG: false,
    BASE_WIDTH : 640,
    BASE_HEIGHT : 480,

    // Atlases
    assetScale: 1,
    assetScaleTexturePrefix: '1',
    gameAtlas: "gameAtlas",
    popupAtlas: "popupAtlas",

    // App variables
    browserName: "",
    currentDevice: 0,
    currentPlatform: 0,
    isWebKitBrowser: false,
    isChromeBrowser: false,
    screenWidth: 0,
    screenHeight: 0,

    // Game variables (automatically set)
    allowSound : true,
    allowInterstitialAds: false,
    allowPurchasing: false,
    hasRetinaDisplay: false,
    isWebGLEnabled: true,
    isLocalStorageEnabled: true,
    showPreloadAnimation: false
};
module.exports = GameSettings;

// ========================= Enums =========================
GameSettings.AssetScales = {
    small: 1,
    medium: 1.75,
    large: 2.5
};
Object.freeze(GameSettings.AssetScales);

GameSettings.TextureAssetScalePrefixes = {
    small: '1x',
    medium: '1.75x',
    large: '2.5x'
};
Object.freeze(GameSettings.TextureAssetScalePrefixes);

GameSettings.Devices = {
    Desktop: 0,
    Tablet: 1,
    Phone: 2
};
Object.freeze(GameSettings.Devices);

GameSettings.Platforms = {
    Arena: 0,
    Android: 1,
    iOS: 2
};
Object.freeze(GameSettings.Platforms);

