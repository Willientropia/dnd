# D&D Fichas

Uma aplicação para criação e gerenciamento de fichas de personagens de D&D, desenvolvida com tecnologias modernas para funcionar em múltiplas plataformas.

## 🚀 Características

- 🖥️ **Desktop**: Aplicação nativa com Electron
- 📱 **Mobile**: App Android com Capacitor  
- 🌐 **Web**: Interface React responsiva
- ☁️ **Cloud**: Sincronização com Firebase
- 🎲 **D&D API**: Integração com Open5e para dados oficiais

## 📁 Estrutura do Projeto

O projeto foi reorganizado com uma estrutura limpa e modular:

```
├── 📁 client/     # Aplicação React
├── 📁 electron/   # Scripts Electron
├── 📁 scripts/    # Scripts de build
├── 📁 android/    # Projeto Android
└── 📁 docs/       # Documentação
```

Veja [STRUCTURE.md](docs/STRUCTURE.md) para detalhes completos.

## 🛠️ Como usar

### Desenvolvimento
```bash
npm run dev           # Executa Electron em modo desenvolvimento
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
