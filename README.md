# D&D Fichas

Uma aplicação para criação e gerenciamento de fichas de personagens de D&D, desenvolvida com Electron para desktop (Windows) e Capacitor para mobile (Android).

## Características

- ✅ Aplicação desktop com Electron
- ✅ Aplicação mobile com Capacitor
- ✅ Integração com Firebase (Firestore + Auth Anônimo)
- ✅ Interface responsiva

## Configuração do Firebase

O app está configurado para usar o Firebase com autenticação anônima e acesso ao Firestore. As regras de segurança permitem leitura/escrita até 17 de agosto de 2025.

## Como executar

### Versão Desktop (Electron)
```bash
npm start
```

### Versão Mobile (Android)
1. Certifique-se de ter o Android Studio instalado
2. Execute:
```bash
npm run build:web
npx cap copy android
npx cap open android
```

## Scripts disponíveis

- `npm start` - Executa a versão Electron
- `npm run dev` - Executa a versão Electron em modo desenvolvimento
- `npm run build:web` - Copia arquivos para o diretório www do Capacitor

## Estrutura do projeto

```
├── main.js           # Processo principal do Electron
├── index.html        # Interface principal da aplicação
├── preload.js        # Script de pré-carregamento do Electron
├── www/              # Arquivos web para o Capacitor
├── android/          # Projeto Android gerado pelo Capacitor
└── capacitor.config.json # Configuração do Capacitor
```

## Tecnologias utilizadas

- **Electron** - Framework para aplicações desktop
- **Capacitor** - Framework para aplicações mobile híbridas  
- **Firebase** - Backend as a Service (Firestore + Authentication)
- **HTML/CSS/JavaScript** - Frontend web
