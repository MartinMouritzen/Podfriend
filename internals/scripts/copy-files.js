/***********************************************************************************************
* This script is needed for the cordova platforms, so the svgs etc. gets copied over
************************************************************************************************/

const fse = require('fs-extra');

const copyFiles = (srcDir,destDir) => {
	try {
		fse.copySync(srcDir,destDir);
		console.log("Image files moved successfully to release folder");
	}
	catch (err) {
		if (err) {
			console.error('Error happened while trying to copy image files: ');
			console.error(err);
		}
	}
};

copyFiles(__dirname + '/../../app/images',__dirname + '/../../release/web/app/images');


copyFiles(__dirname + '/../../cordova/cordova-plugin-media',__dirname + '/../../node_modules/cordova-plugin-media');
copyFiles(__dirname + '/../../cordova/cordova-plugin-media/src/ios',__dirname + '/../../ios/capacitor-cordova-ios-plugins/sources/CordovaPluginMedia');


copyFiles(__dirname + '/../../cordova/cordova-plugin-music-controls2',__dirname + '/../../node_modules/cordova-plugin-music-controls2');
copyFiles(__dirname + '/../../cordova/cordova-plugin-music-controls2/src/ios',__dirname + '/../../ios/capacitor-cordova-ios-plugins/sources/CordovaPluginMusicControls2');