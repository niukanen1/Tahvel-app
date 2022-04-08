const { app, BrowserWindow } = require("electron");
const path = require("path");
const { RunTahvel } = require("./tahvelprocc.js");
const { ipcMain } = require("electron");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

const Store = require("electron-store");
const store = new Store();

console.log("CURRENT USERDATA");
console.log(store.get("user"));

const createWindow = () => {
	
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			preload: __dirname + "/preload.js",
		},
	});
    global.share = {
		ipcMain: ipcMain,
		win: mainWindow,
	};
	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	app.quit();
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
ipcMain.on("browserWasClosed", async (event, arg) => {
	console.log("browserWasClosed");
});
ipcMain.handle("openTahvel", async (event, arg) => {
	console.log("ARG in main");
	console.log(arg);
	try {
		const results = await RunTahvel(arg).then(async (res) => {
			if (res == true) {
				return ["Finished", true];
			} else if (res == "timeout") {
				return ["error", res];
			} else if (res == "invalidCode") {
				return ["error", res];
			} else {
				console.log("error is " + res);
				return res;
			}
		});
		// console.log(res)
		return results;
	} catch {}
});

ipcMain.on("resetStore", async (event, arg) => {
	try {
		store.set("user", { name: "", code: "" });
	} catch (err) {
		console.log(err);
	}
});
ipcMain.on("storeUser", async (event, arg) => {
	try {
		store.set("user", arg);
		// console.log(store.get("user"));
	} catch (err) {
		console.log("ERROR::: " + err);
	}
});

ipcMain.handle("getUser", (event, arg) => {
	try {
		// console.log(store.get("user"))
		return store.get("user");
	} catch (err) {
		console.log("ERROR:: " + err);
	}
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
