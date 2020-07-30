class WindowManager {
	createWindow(config) {
		var newWindow = new BrowserWindow(config);
		return newWindow;
	}
}
export default WindowManager;