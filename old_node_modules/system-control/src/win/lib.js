const { speaker } = require('win-audio');
const brightness = require('brightness');

module.exports = {
    audio: {
        getVolume: speaker.get,
        setVolume: speaker.set,
        isMuted: speaker.isMuted,
        setMuted: async value => value ? speaker.mute() : speaker.unmute(),
    },
    display: {
        setBrightness: brightness.set,
        getBrightness: brightness.get,
    },
};
