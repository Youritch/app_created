const {app, BrowserWindow, ipcMain, dialog, Menu} = require("electron");
const path = require("path");
const api = require("./api/api.js");

async function openDirApp(event) {
	const {
		canceled,
		filePaths
	} = await dialog.showOpenDialog({properties: ["openDirectory"] /*filters: [{ name: "html", extensions: ["html"] }] */});
	if (canceled) return false;
	const mainWin = BrowserWindow.fromWebContents(event.sender);
	const files = ["info.json", "event", "pages", "pages/home.html", "event/ex.js"];
	for (const f in files) {
		if (!(await api.file.existFile(`${filePaths[0]}/${files[f]}`))) {
			if (files[f].includes(".")) {
				const data = await api.file.readFile(`data/utils/appPatern/${files[f]}`);
				await api.file.writeFile(`${filePaths[0]}/${files[f]}`, data !== false ? data : "");
				mainWin.webContents.send("popup", {
					type: "warn",
					title: files[f] + " à été créé",
					message: filePaths[0]
				});
			} else {
				await api.file.createDir(filePaths[0], files[f]);
				mainWin.webContents.send("popup", {
					type: "warn",
					title: "/" + files[f] + " à été créé",
					message: filePaths[0]
				});
			}
		}
	}
	const info = JSON.parse(await api.file.readFile(`${filePaths[0]}/info.json`));
	console.log(info);
	if (!(await api.file.existFile(`data/customApp/${info.name}.json`))) {
		let complet = true,
			manque = [];
		const champs = Object.keys(info);
		for (const c in champs) {
			if (info[champs[c]] === "") {
				complet = false;
				manque.push(champs[c]);
			}
		}
		if (!complet) return mainWin.webContents.send("popup", {
			type: "error",
			title: "Remplir \"<strong>info.json</strong>\"",
			message: "Il faut remplir le fichier \"<strong>info.json</strong>\" qui se trouve " + filePaths[0] + "\nIl manque les champs : " + manque.join(", ")
		});
		await api.file.writeFile(`data/customApp/${info.name}.json`, {info: info, path: filePaths[0]});
	}
	//const htmlfile = require(path.relative(__dirname,filePaths[0]));
	const customAppWin = new BrowserWindow({
		width: info.dimension.width,
		height: info.dimension.height,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
		title: `${info.name} - ${info.version}`,
	});
	await customAppWin.loadFile("data/utils/app.html");
	customAppWin.webContents.send("load-page", [await api.file.readFile(`${filePaths[0]}/pages/home.html`)]);
	mainWin.webContents.send("popup", {
		type: "info",
		title: "Tout est bon !",
		message: "Toute l'app a été créer/mis à jours."
	});
	return filePaths[0];
}

async function handleFileComp() {
	const {canceled, filePaths} = await dialog.showOpenDialog({
		properties: ["openFile"],
		filters: [{name: "html", extensions: ["html"]}]
	});
	if (!canceled) {
		//const htmlfile = require(path.relative(__dirname,filePaths[0]));
		return await api.file.readFile(filePaths[0]);
	}
	return false;
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
		const win = BrowserWindow.fromWebContents(event.sender);
		win.setTitle(title);
	});
	const menu = Menu.buildFromTemplate([
		{
			label: app.name,
			submenu: [
				{
					click: () => {
						if (win.webContents.isDevToolsOpened()) return win.webContents.closeDevTools();
						return win.webContents.openDevTools();
					},
					label: "Dev Tools",
					accelerator: process.platform === "darwin" ? "Alt+Cmd+I" : "Alt+Shift+I",
				},
				{
					click: () => {
						app.quit();
					},
					accelerator: process.platform === "darwin" ? "Cmd+q" : "Alt+f4",
					label: "Quit",
				},
				{
					click: () => {
						win.webContents.send("load");
					},
					accelerator: process.platform === "darwin" ? "Cmd+r" : "Alt+r",
					label: "Reload",
				},
				{
					type: "separator"
				},
				{
					click: () => {
						win.webContents.send("popup", {
							type: "info",
							title: "Tous se passe bien !",
							message: "et oui !"
						});
					},
					accelerator: process.platform === "darwin" ? "Cmd+p" : "Alt+p",
					label: "popup",
				},
			],
		},
		//Menu.getApplicationMenu().commandsMap["42"],
		//Menu.getApplicationMenu().commandsMap["47"],
		//Menu.getApplicationMenu().commandsMap["52"],
	]);
	Menu.setApplicationMenu(menu);
	win.loadFile("index.html");
	return win;
};
app.whenReady().then(() => {
	createWindow();
	ipcMain.on("load", async (event) => {
		console.log("handling 'load'");
		event.sender.send("popup", {type: "info", title: "Reload !", message: "et oui !"});
		try {
			//const data = await api.file.readFile("test/pages/home.html");
			event.sender.send("load-page", []);
		} catch (err) {
			console.log(err);
		}
	});
	ipcMain.handle("dialog:openFile", openDirApp);
	ipcMain.handle("dialog:openComp", handleFileComp);
	ipcMain.handle("emit", (event, {name, data}) => {
		console.log(`It's coming...\n${name}: ${JSON.stringify(data)}`);
		return event.sender.send(name, data);
	});
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
	app.quit();
});
