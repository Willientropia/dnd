# 🔥 Guia de Configuração Firebase para D&D Character Creator

## Problemas Comuns e Soluções

### 1. "Erro ao conectar com o servidor"

#### Possíveis Causas:
- Login anônimo não habilitado no Firebase
- Regras do Firestore muito restritivas
- Configuração incorreta do projeto

#### Soluções:

### 📋 1. Verificar Login Anônimo
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `dnd-character-creator-4f39b`
3. Vá para **Authentication** > **Sign-in method**
4. Procure por **Anonymous** na lista de provedores
5. Se estiver desabilitado, clique nele e **habilite**
6. Salve as alterações

### 📋 2. Configurar Regras do Firestore
1. No Firebase Console, vá para **Firestore Database**
2. Clique na aba **Rules**
3. Substitua as regras existentes pelo conteúdo do arquivo `firestore.rules`
4. Clique em **Publish**

### 📋 3. Verificar Configuração do Projeto
```javascript
// Verifique se a configuração em src/services/firebase.js está correta:
const firebaseConfig = {
    apiKey: "AIzaSyB_cD7jTA4NuG0mMKeHsJlY9lBfElKHdWA",
    authDomain: "dnd-character-creator-4f39b.firebaseapp.com",
    projectId: "dnd-character-creator-4f39b",
    storageBucket: "dnd-character-creator-4f39b.firebasestorage.app",
    messagingSenderId: "428339560101",
    appId: "1:428339560101:web:3031100a258b658cc9d74c",
    measurementId: "G-PENVZK9V8N"
};
```

### 📋 4. Testar Conexão
1. Abra http://localhost:3001/test-firebase.html
2. Clique em "Testar Conexão"
3. Verifique se todos os testes passam

### 📋 5. Verificar Console do Navegador
1. Abra o app principal: http://localhost:3001
2. Abra as ferramentas de desenvolvedor (F12)
3. Vá para a aba Console
4. Procure por mensagens de erro específicas

## Códigos de Erro Comuns

### `auth/operation-not-allowed`
- **Causa**: Login anônimo não habilitado
- **Solução**: Habilitar Anonymous provider no Firebase Console

### `permission-denied`
- **Causa**: Regras do Firestore muito restritivas
- **Solução**: Atualizar regras do Firestore

### `auth/network-request-failed`
- **Causa**: Problema de conectividade
- **Solução**: Verificar conexão com internet

### `auth/invalid-api-key`
- **Causa**: API key incorreta ou projeto inexistente
- **Solução**: Verificar configuração do Firebase

## Estrutura de Dados Esperada

```
users/{userId}/
├── createdAt: timestamp
├── isAnonymous: true
└── characters/{characterId}/
    ├── name: string
    ├── race: object
    ├── class: object
    ├── abilities: object
    ├── spells: object
    └── ...outros campos
```

## Logs de Debug

O app agora inclui logs detalhados no console:
- 🔄 = Operação em progresso
- ✅ = Sucesso
- ❌ = Erro
- ⚠️ = Aviso

## Próximos Passos após Correção

1. Testar criação de personagem
2. Testar salvamento múltiplos personagens
3. Testar seleção de magias
4. Testar edição de atributos
