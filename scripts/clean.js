#!/usr/bin/env node

/**
 * Script para limpeza de arquivos de build e cache
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Iniciando limpeza de arquivos...');

const pathsToClean = [
  'client/dist',
  'client/node_modules/.vite',
  'android/app/build',
  'node_modules/.cache'
];

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    try {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ Removido: ${folderPath}`);
    } catch (error) {
      console.log(`⚠️ Não foi possível remover: ${folderPath} - ${error.message}`);
    }
  } else {
    console.log(`ℹ️ Não existe: ${folderPath}`);
  }
}

// Voltar para a raiz do projeto
process.chdir(path.join(__dirname, '..'));

pathsToClean.forEach(deleteFolderRecursive);

console.log('✅ Limpeza concluída!');
