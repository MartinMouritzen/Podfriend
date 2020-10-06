# system-control
Node.js module to configure basic system parameters (brightness and audio).

## Installation
```bash
npm install system-control

# Based on the os, install corresponding peer dependencies

# For Windows users,
npm install win-audio
# For Unix users,
npm install loudness
```

## Usage
```js
const { audio } = require('system-control');

audio.volume().then(volume => console.log(volume)) // get system volume
audio.volume(80)
  .then(() => console.log('volume changed')) // set system volume
  .catch((err) => console.error(err));
```
```js
import { audio } from 'system-control';

(async () => {
  const volume = await audio.volume() // get system volume
  try {
    await audio.volume(80) // set system volume
    console.log(`volume changed from ${volume} to 80`)
  } catch (e) {
    console.error(e);
  }
})()
```

## API
### systemControl.audio
#### volume
`value`: number | undefined<br>
```js
await audio.volume(10) // set volume
await audio.volume() // get volume
```

#### muted
`value`: boolean | undefined<br>
```js
await audio.muted(true) // set muted
await audio.muted() // get muted
```

### systemControl.display
#### brightness
`value`: number | undefined<br>
```js
await display.brightness(10) // set brightness
await display.brightness() // get brightness
```
