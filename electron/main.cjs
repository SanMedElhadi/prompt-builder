const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const templatesPath = path.join(app.getPath('userData'), 'templates.json');

// IPC Handlers
ipcMain.handle('get-templates', async () => {
  try {
    if (fs.existsSync(templatesPath)) {
      const data = fs.readFileSync(templatesPath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading templates:', error);
    return [];
  }
});

ipcMain.handle('save-templates', async (event, templates) => {
  try {
    fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving templates:', error);
    return { success: false, error: error.message };
  }
});

function createWindow() {
  const isDev = !app.isPackaged;

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: isDev
      ? path.join(__dirname, '../public/logo.png')
      : path.join(__dirname, '../dist/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });



  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
