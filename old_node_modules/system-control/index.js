function getImpl(platform) {
  switch (platform) {
    case 'linux':
    case 'darwin':
      return require('./src/unix/lib');
    case 'win32':
      return require('./src/win/lib');
    default:
      throw new Error("Unsupported platform: " + platform)
  }
};

function addAliasMethods(impl) {
  return {
    audio: {
      ...impl.audio,
      volume: value =>
        value !== undefined ? impl.audio.setVolume(value) : impl.audio.getVolume(),
      muted: value =>
        value !== undefined ? impl.audio.setMuted(value) : impl.audio.isMuted(),
    },
    display: {
      ...impl.display,
      brightness: value =>
        value !== undefined ? impl.display.setBrightness(value) : impl.display.getBrightness()
    },
  };
}

module.exports = addAliasMethods(
  getImpl(process.platform)
);
