# win-audio
Get, Set and Watch Speaker/Microphone Volume on Windows

[![Build status](https://ci.appveyor.com/api/projects/status/iwo2mdxkn5fsday1?svg=true)](https://ci.appveyor.com/project/fcannizzaro/win-audio)
[![npm](https://img.shields.io/npm/v/win-audio.svg)](https://www.npmjs.com/package/win-audio)
[![npm](https://img.shields.io/npm/dm/win-audio.svg)](https://www.npmjs.com/package/win-audio)

# Install

```sh
npm i --save win-audio
```

### Requirements
[node-gyp](https://github.com/nodejs/node-gyp#installation) to build **audio-napi.cc**

### Version 2.0.0
This version requires **N-API**, and **node** version **>= 8.6.0**

# Module
```javascript
 const win = require('win-audio');

 // manage speaker volume
 const speaker = win.speaker;

 // manage mic volume
 const microphone = win.mic;
```

# Usage

```javascript
const audio = require('win-audio').speaker;

audio.polling(200);

audio.events.on('change', (volume) => {
  console.log("old %d%% -> new %d%%", volume.old, volume.new);
});

audio.events.on('toggle', (status) => {
  console.log("muted: %s -> %s", status.old, status.new);
});

audio.set(40);

audio.increase(20);

audio.decrease(10);

audio.mute();
```

# Functions

#### `polling(interval: int = 500)`

- interval: milliseconds for check volume changes.

#### `get()`
**Return** current percentage of volume.

#### `isMuted()`
**Return** if speaker/mic is muted.

#### `set(value: int)`

 Set a new master volume.
 
 - value: percentage of new volume. **[0-100]**

#### `increase(value: int)`

Increase current volume of value %.

- value: percentage. **[0-100]**

#### `decrease(value: int)`

Decrease current volume of value %.

- value: percentage. **[0-100]**

#### `mute()`
Mute volume.

#### `unmute()`
Unmute volume.

#### `toggle()`
Mute/Unmute volume according to current status.

## Events

#### `change`
Called when volume is changed.

#### `toggle`
Called when volume is muted/unmuted.

# Thanks to
[Sebastian R (11AND2)](https://github.com/11AND2)


# Author
Francesco Saverio Cannizzaro
