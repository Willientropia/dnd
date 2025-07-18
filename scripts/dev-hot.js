#!/usr/bin/env node

/**
 * Script para desenvolvimento com hot reload
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🔥 Iniciando modo desenvolvimento com hot reload...');

// Inicia o Vite em modo dev na pasta client
console.log('🚀 Iniciando servidor Vite...');
const viteProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..', 'client'),
  stdio: 'inherit',
  shell: true
});

// Aguarda um pouco para o Vite iniciar
setTimeout(() => {
  console.log('🖥️ Iniciando Electron...');
  
  // Cria um main.js temporário que aponta para o servidor Vite
  const electronMainDev = `
const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Conecta ao servidor Vite local
  win.loadURL('http://localhost:5173');
  
  // Abre DevTools em desenvolvimento
  win.webContents.openDevTools();
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
`;

  // Salva o arquivo temporário
  const fs = require('fs');
  const tempMainPath = path.join(__dirname, '..', 'electron', 'main-dev.js');
  fs.writeFileSync(tempMainPath, electronMainDev);
  
  // Inicia o Electron
  const electronProcess = spawn('electron', [tempMainPath], {
    stdio: 'inherit',
    shell: true
  });

  // Cleanup ao encerrar
  process.on('SIGINT', () => {
    console.log('\\n🛑 Encerrando processos...');
    viteProcess.kill();
    electronProcess.kill();
    if (fs.existsSync(tempMainPath)) {
      fs.unlinkSync(tempMainPath);
    }
    process.exit();
  });

}, 3000);
