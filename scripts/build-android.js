#!/usr/bin/env node

/**
 * Script para build da aplicação Android com Capacitor
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🤖 Iniciando build do Android...');

try {
  // Voltar para a raiz do projeto
  process.chdir(path.join(__dirname, '..'));
  
  console.log('📱 1. Fazendo build do React...');
  execSync('node scripts/build-react.js', { stdio: 'inherit' });
  
  console.log('📱 2. Copiando arquivos para o Capacitor...');
  execSync('npx cap copy android', { stdio: 'inherit' });
  
  console.log('📱 3. Abrindo projeto Android...');
  execSync('npx cap open android', { stdio: 'inherit' });
  
  console.log('✅ Build do Android iniciado com sucesso!');
} catch (error) {
  console.error('❌ Erro no build do Android:', error.message);
  process.exit(1);
}
