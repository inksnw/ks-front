const {override, addDecoratorsLegacy} = require("customize-cra");

module.exports = override(
    fsPatch,
    addDecoratorsLegacy(),
)

function fsPatch(config, env) {
    config.resolve.fallback = {'path': require.resolve("path-browserify"), 'fs': false}
    return config;
}
