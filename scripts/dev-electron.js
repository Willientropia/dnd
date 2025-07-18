#!/usr/bin/env node

/**
 * Script para executar a aplicação Electron em modo desenvolvimento
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🖥️ Iniciando aplicação Electron em modo dev...');

try {
  // Voltar para a raiz do projeto
  process.chdir(path.join(__dirname, '..'));
  
  console.log('🔨 1. Fazendo build do React...');
  execSync('node scripts/build-react.js', { stdio: 'inherit' });
  
  console.log('🖥️ 2. Iniciando Electron...');
  execSync('electron electron/main.js --dev', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Erro ao executar Electron:', error.message);
  process.exit(1);
}
