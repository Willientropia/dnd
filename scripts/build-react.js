#!/usr/bin/env node

/**
 * Script para build da aplicação React
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Iniciando build do React...');

try {
  // Navegar para a pasta client e fazer build
  process.chdir(path.join(__dirname, '..', 'client'));
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build do React concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro no build do React:', error.message);
  process.exit(1);
}
