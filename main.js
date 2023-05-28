const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

async function handleFileOpen() {
	const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ["openFile"], extensions: ["js"], filters: [{ name: "js", extensions: ["js"] }] });
	if (!canceled) {
      const jsfile = require(path.relative(__dirname,filePaths[0]));
      console.log(jsfile.random(10));
		return filePaths[0];
	}
	return "";
}

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});
	ipcMain.on("set-title", (event, title) => {
		const webContents = event.sender;
		const win = BrowserWindow.fromWebContents(webContents);
		win.setTitle(title);
	});
	win.loadFile("index.html");
};

app.whenReady().then(() => {
	ipcMain.handle("dialog:openFile", handleFileOpen);
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
