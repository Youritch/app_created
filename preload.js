const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	setTitle: (title) => ipcRenderer.send("set-title", title),
	openFile: () => ipcRenderer.invoke("dialog:openFile"),
	openCompt: () => ipcRenderer.invoke("dialog:openComp"),
	load: () => ipcRenderer.send("load"),
	/**
	 * @param {string} name - event name
	 * @param {Function} callback - event name
	 * @param {boolean} once - on/once event
	 */
	addEventListener: (name, callback, once = false) => {
		if (once) {
			console.log(`Load once event "${name}" !`);
			return ipcRenderer.once(name, (event, data = {}) => {
				console.log(`I'was emited ! (${name})\nIt would be the first and last time !\nMy body contain : ${JSON.stringify(data)}`);
				return callback(event, data);
			});
		}
		console.log(`Load event "${name}" !`);
		return ipcRenderer.on(name, (event, data = {}) => {
			console.log(`I'was emited ! (${name})\nMy body contain : ${JSON.stringify(data)}`);
			return callback(event, data);
		});
	},
	emit: (name, data = {}) => {
		console.log(`Emited ${name} (from preload) with data : ${JSON.stringify(data)}`);
		return ipcRenderer.invoke("emit", { name: name, data: data });
	},
});
