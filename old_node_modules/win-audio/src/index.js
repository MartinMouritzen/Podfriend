const EventEmitter = require('events');
const audio = require('../build/Release/audio.node');

var init = (mic) => {

  const events = new EventEmitter();

  var data = {
    audio: audio.get(mic),
    status: audio.isMuted(mic)
  };

  /**
   * Check and update current volume. [Generic]
   */
  var _check = (fn, key, event) => {

    let now = fn(mic);

    if (key == 'status') {
      now = Boolean(now);
    }

    if (data[key] != now) {
      events.emit(event, {
        old: data[key],
        new: now
      });
    }

    data[key] = now;

  };

  /**
   * Check and update current volume.
   */
  var check = () => {
    _check(audio.get, 'audio', 'change');
    _check(audio.isMuted, 'status', 'toggle');
  };

  /**
   * Get current audio
   */
  var get = () => audio.get(mic);

  /**
   * Update current and delegate audio set to native module.
   */
  var set = (value) => {
    audio.set(value, mic);
    check();
  };

  /**
   * Save current status and mute volume.
   */
  var mute = () => audio.mute(mic, 1);


  /**
   * Restore previous volume.
   */
  var unmute = () => audio.mute(mic, 0);

  /**
   * Mute/Unmute volume.
   */
  var toggle = () => {
    if (audio.isMuted(mic))
      unmute();
    else
      mute();
  };

  /**
   * React to volume changes using polling check.
   */
  var polling = (interval) => setInterval(check, interval || 500);

  /**
   * Increase current volume of value%
   */
  var increase = (value) => {

    unmute();

    let perc = data.audio + value;

    if (perc < 0)
      perc = 0;

    if (perc > 100)
      perc = 100;

    set(perc);

  };

  /**
   * Decrease current volume of value%
   */
  var decrease = (value) => increase(-value);


  /**
   * Check if is muted
   */
  var isMuted = () => audio.isMuted(mic) == 1;

  return {
    events: events,
    polling: polling,
    get: get,
    set: set,
    increase: increase,
    decrease: decrease,
    mute: mute,
    unmute: unmute,
    isMuted: isMuted,
    toggle: toggle
  }

}

module.exports = {
  speaker: init(0),
  mic: init(1)
};
