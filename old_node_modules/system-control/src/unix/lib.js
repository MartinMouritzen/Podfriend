const { promisify } = require('util');

const loudness = require('loudness');
const brightness = require('brightness');

module.exports = {
    audio: {
        getVolume: promisify(loudness.getVolume),
        setVolume: promisify(loudness.setVolume),
        isMuted: promisify(loudness.getMuted),
        setMuted: promisify(loudness.setMuted),
    },
    display: {
        setBrightness: brightness.set,
        getBrightness: brightness.get,
    },
};
