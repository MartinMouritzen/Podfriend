const fse = require('fs-extra');

const srcDir = __dirname + '\\..\\app\\images';
const destDir = __dirname + '\\..\\release\\web\\app\\images';
                              
// To copy a folder or file  

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