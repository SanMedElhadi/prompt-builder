const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getTemplates: () => ipcRenderer.invoke('get-templates'),
    saveTemplates: (templates) => ipcRenderer.invoke('save-templates', templates),
    getTopics: () => ipcRenderer.invoke('get-topics'),
    saveTopics: (topics) => ipcRenderer.invoke('save-topics', topics)
});
