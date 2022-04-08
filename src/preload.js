const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
    test: (value) => ipcRenderer.on('test', value), 
    storeUser: (value) => ipcRenderer.send("storeUser", {name: value.name, code: value.code}),
    openTahvel: (value) => ipcRenderer.invoke("openTahvel", value),
    getUser: () => ipcRenderer.invoke("getUser"),
    closeBrowser: (value) => ipcRenderer.send("closeBrowser", value),
    progress: async () => await ipcRenderer.invoke("progress"),
    resetStore: () => ipcRenderer.send("resetStore"),
})
