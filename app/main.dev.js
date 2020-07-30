/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
 
console.log('Starting Podfriend in environment: ' + process.env.NODE_ENV);

import { app, screen, BrowserWindow, globalShortcut, ipcMain, Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// import MenuBuilder from './menu';

const { audio } = require('system-control');

require('electron-debug')();

app.commandLine.appendSwitch('--autoplay-policy','no-user-gesture-required');

let podfriendIcon = __dirname + '/images/logo/podfriend_logo_128x128.png';
// let podfriendIcon = __dirname + '/../resources/icon.ico';

var autoUpdatesEnabled = false;

var systemTray;

var miniWindows = [
	{
		width: 200,
		height: 100
	},
	{
		width: 200,
		height: 60
	},
	{
		width: 400,
		height: 30
	}
];
var selectedMiniWindow = 0;

export default class AppUpdater {
	constructor() {
		if (autoUpdatesEnabled) {
			log.transports.file.level = 'info';
			autoUpdater.logger = log;
			autoUpdater.checkForUpdatesAndNotify();
		}
	}
}

let mainWindow = null;
let quickViewWindow = null;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

if (
	process.env.NODE_ENV === 'development' ||
	process.env.DEBUG_PROD === 'true'
) {
	require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

	return Promise.all(
		extensions.map(name => installer.default(installer[name], forceDownload))
	).catch(console.log);
};

/**
* IPC events
*/
ipcMain.on('windowMoving', (e, {mouseX, mouseY}) => {
	const { x, y } = screen.getCursorScreenPoint()
	quickViewWindow.setBounds({
		width: miniWindows[selectedMiniWindow].width,
		height: miniWindows[selectedMiniWindow].height,
		x: x - mouseX,
		y: y - mouseY
	});
});

ipcMain.on('miniWindowLayoutChange', () => {
	selectedMiniWindow++;
	if (selectedMiniWindow >= miniWindows.length) {
		selectedMiniWindow = 0;
	}
	console.log(miniWindows[selectedMiniWindow].height);
	
	var bounds = quickViewWindow.getBounds();
	
	quickViewWindow.setBounds({
		width: miniWindows[selectedMiniWindow].width,
		height: miniWindows[selectedMiniWindow].height,
		x: bounds.x,
		y: bounds.y
	});
});

ipcMain.on('requestPlay', () => {
	mainWindow.webContents.executeJavaScript('Events.emit(\'MediaPlayPause\',false)');
});

ipcMain.on('PFMessageToMiniWindow',(event,message) => {
	console.log('PFMessageToMiniWindow');
	console.log(message);
	quickViewWindow.webContents.send(message.type,message.content);
	// ipcMain.send(message.type,message.content);
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', async () => {
	
	globalShortcut.register('VolumeUp', () => {
		console.log('VolumeUp');
		// console.log(audio.getVolume());

		var volume = audio.getVolume();
		
		if (volume.then) {
			volume.then((volume) => {
				audio.setVolume(volume + 2);
			});
		}
		else {
			audio.setVolume(volume + 2);
		}
		
		// mainWindow.webContents.executeJavaScript('Events.emit(\'VolumeUp\',false)');
		// quickViewWindow.webContents.executeJavaScript('Events.emit(\'VolumeUp\',false)');
	});
	
	globalShortcut.register('CommandOrControl+Shift+K', () => {
		mainWindow.webContents.openDevTools()
	})
	
	globalShortcut.register('VolumeDown', () => {
		console.log('VolumeDown');

		var volume = audio.getVolume();
		
		if (volume.then) {
			volume.then((existingVolume) => {
				audio.setVolume(existingVolume - 2);
			});
		}
		else {
			audio.setVolume(volume - 2);
		}
		// mainWindow.webContents.executeJavaScript('Events.emit(\'VolumeDown\',false)');
		// quickViewWindow.webContents.executeJavaScript('Events.emit(\'VolumeDown\',false)');
	});
	
	globalShortcut.register('VolumeMute', () => {
		console.log('VolumeMute');
		
		var mutedStatus = audio.isMuted();
		
		if (mutedStatus.then) {
			mutedStatus.then((existingMutedStatus) => {
				audio.setMuted(!existingMutedStatus);
			});
		}
		else {
			audio.setMuted(!mutedStatus);
		}

		// mainWindow.webContents.executeJavaScript('Events.emit(\'VolumeMute\',false)');
		// quickViewWindow.webContents.executeJavaScript('Events.emit(\'VolumeMute\',false)');
	});
	
	globalShortcut.register('MediaPlayPause', () => {
		// console.log('MediaPlayPause');
		// playPause();
		
		mainWindow.webContents.executeJavaScript('Events.emit(\'MediaPlayPause\',false)');
		// quickViewWindow.webContents.executeJavaScript('Events.emit(\'MediaPlayPause\',false)');
	});
	
	globalShortcut.register('MediaStop', () => {
		console.log('MediaStop - BUT - we are sending playpause for now.');
		// playPause();
		// mainWindow.webContents.executeJavaScript('Events.emit(\'MediaStop\',false)');
		// quickViewWindow.webContents.executeJavaScript('Events.emit(\'MediaStop\',false)');
		
		mainWindow.webContents.executeJavaScript('Events.emit(\'MediaPlayPause\',false)');
		// quickViewWindow.webContents.executeJavaScript('Events.emit(\'MediaPlayPause\',false)');
	});
	
	globalShortcut.register('MediaNextTrack', () => {
		console.log('MediaNextTrack');
		mainWindow.webContents.executeJavaScript('Events.emit(\'MediaNextTrack\',false)');
		// quickViewWindow.webContents.executeJavaScript('Events.emit(\'MediaNextTrack\',false)');
		// next();
	});
	
	globalShortcut.register('MediaPreviousTrack', () => {
		mainWindow.webContents.executeJavaScript('Events.emit(\'MediaPreviousTrack\',false)');
		// quickViewWindow.webContents.executeJavaScript('Events.emit(\'MediaPreviousTrack\',false)');
		console.log('MediaPreviousTrack');
		// previous();
	});
	
	
	if (
		process.env.NODE_ENV === 'development' ||
		process.env.DEBUG_PROD === 'true'
	) {
		await installExtensions();
	}

	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		minWidth: 320,
		minHeight: 480,
		frame: false,
		transparent: true,
		webPreferences: {
			experimentalFeatures: true
		},
		icon: podfriendIcon
	});
	
	quickViewWindow = new BrowserWindow({
		show: false,
		width: miniWindows[selectedMiniWindow].width,
		height: miniWindows[selectedMiniWindow].height,
		minWidth: 200,
		minHeight: 60,
		frame: false,
		transparent: true,
		skipTaskbar: true,
		alwaysOnTop: true,
		webPreferences: {
			experimentalFeatures: true
		},
		icon: podfriendIcon
	});
	quickViewWindow.setResizable(false);
	
	mainWindow.webContents.on('did-fail-load',(event) => {
		console.log('Failed to load url!');
		console.log(event);
		mainWindow.loadURL(`file://${__dirname}/app.html`);
	});
	
	mainWindow.on('app-command',(e,cmd) => {
		if (cmd === 'browser-backward') {
			mainWindow.webContents.executeJavaScript('Events.emit(\'OnNavigateBackward\',false)');
		}
		else if (cmd === 'browser-forward') {
			mainWindow.webContents.executeJavaScript('Events.emit(\'OnNavigateForward\',false)');
		}
	});

	// console.log('Main window loading file');
	// console.log(`file://${__dirname}/app.html`);
	mainWindow.loadURL(`file://${__dirname}/app.html`);
	
	quickViewWindow.loadURL(`file://${__dirname}/miniwindow.html`);

	// @TODO: Use 'ready-to-show' event
	//				https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
	mainWindow.webContents.on('did-finish-load', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			console.log('Main window showing');
			mainWindow.show();
			mainWindow.focus();
			
			// quickViewWindow.show();
		}
	});
	
	mainWindow.on('close', function (event) {
		event.preventDefault();
		mainWindow.hide();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
		quickViewWindow.close();
	});
	
	quickViewWindow.on('closed', () => {
		quickViewWindow = null;
	});
	
	// System tray
	app.whenReady().then(() => {
		systemTray = new Tray(podfriendIcon);
		systemTray.setHighlightMode('always');
		const trayContextMenu = Menu.buildFromTemplate([
			{ label: 'Show Podfriend window', click: () => {
				mainWindow.show();
			}},
			{ label: 'Item2', type: 'radio' },
			{ label: 'Item3', type: 'radio', checked: true },
			{ label: 'Exit Podfriend', click: () => {
				mainWindow.destroy();
				app.quit();	
			}}
		]);
		systemTray.setContextMenu(trayContextMenu);
		systemTray.setToolTip('Podfriend');
	});

	// const menuBuilder = new MenuBuilder(mainWindow);
	// menuBuilder.buildMenu();

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	
	if (autoUpdatesEnabled) {
		new AppUpdater();
	}
});
