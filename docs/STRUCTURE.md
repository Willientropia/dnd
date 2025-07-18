# D&D Fichas - Estrutura do Projeto

## 📁 Estrutura de Pastas

```
dnd-fichas/
├── 📁 client/              # Aplicação React (frontend)
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Serviços (API, Firebase, etc.)
│   │   │   ├── api.js      # Funções da API D&D
│   │   │   ├── firebase.js # Configuração Firebase
│   │   │   └── index.js    # Barrel exports
│   │   └── ...
│   └── dist/              # Build da aplicação React
├── 📁 electron/            # Scripts do Electron (desktop)
│   ├── main.js            # Processo principal do Electron
│   └── preload.js         # Script de preload
├── 📁 scripts/             # Scripts de build e utilitários
│   ├── build-react.js     # Build da aplicação React
│   ├── build-android.js   # Build para Android
│   ├── dev-electron.js    # Desenvolvimento Electron
│   ├── start-electron.js  # Produção Electron
│   └── clean.js           # Limpeza de arquivos
├── 📁 android/             # Projeto Android (Capacitor)
├── 📁 docs/                # Documentação e arquivos legacy
└── 📄 package.json         # Configuração do projeto
```

## 🚀 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev           # Executa Electron em modo desenvolvimento (build + electron)
npm run dev:hot       # Modo desenvolvimento com hot reload (Vite + Electron)
```

### Build
```bash
npm run build:react   # Faz build da aplicação React
npm run build:web     # Alias para build:react
npm run build:android # Build para Android (abre Android Studio)
```

### Produção
```bash
npm start            # Executa Electron em modo produção
```

### Utilitários
```bash
npm run clean        # Remove arquivos de build e cache
```

## 🏗️ Plataformas Suportadas

- **🖥️ Desktop**: Electron (Windows, macOS, Linux)
- **📱 Mobile**: Capacitor + Android
- **🌐 Web**: React + Vite (pode ser hospedado)

## 🔧 Tecnologias

- **Frontend**: React 19 + Vite
- **Desktop**: Electron
- **Mobile**: Capacitor
- **Backend**: Firebase (Auth + Firestore)
- **API Externa**: Open5e D&D API
