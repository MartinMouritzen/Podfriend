const audio = require('./src/index').speaker;

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

console.log(audio.isMuted());