import React, { useState, useEffect } from 'react';
import { db, auth, signInAnonymously } from './services';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import CharacterCreator from './components/CharacterCreator';
import CharacterSheet from './components/CharacterSheet';
import CharacterMenu from './components/CharacterMenu';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentView, setCurrentView] = useState('menu'); // 'menu', 'create', 'sheet'

    useEffect(() => {
        const initializeApp = async () => {
            try {
                console.log('🔄 Iniciando autenticação anônima...');
                
                // Verifica se já existe um usuário autenticado
                const existingUser = auth.currentUser;
                if (existingUser) {
                    console.log('✅ Usuário já autenticado:', existingUser.uid);
                    setUser(existingUser);
                    setLoading(false);
                    return;
                }

                // Realiza login anônimo
                const userCredential = await signInAnonymously(auth);
                const uid = userCredential.user.uid;
                console.log('✅ Login anônimo realizado com sucesso:', uid);
                setUser(userCredential.user);
                
                // Initialize user document if it doesn't exist
                console.log('🔄 Verificando documento do usuário...');
                const userDocRef = doc(db, "users", uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (!userDocSnap.exists()) {
                    console.log('📝 Criando documento do usuário...');
                    await setDoc(userDocRef, { 
                        createdAt: new Date(),
                        isAnonymous: true 
                    });
                    console.log('✅ Documento do usuário criado');
                } else {
                    console.log('✅ Documento do usuário já existe');
                }
                
                console.log('✅ Inicialização concluída com sucesso');
            } catch (error) {
                console.error("❌ Erro ao inicializar:", error);
                
                // Mensagens de erro mais específicas
                let errorMessage = "Erro ao conectar com o servidor.";
                
                if (error.code === 'auth/operation-not-allowed') {
                    errorMessage = "Login anônimo não está habilitado no Firebase. Entre em contato com o administrador.";
                } else if (error.code === 'auth/network-request-failed') {
                    errorMessage = "Erro de conexão com a internet. Verifique sua conexão.";
                } else if (error.code === 'permission-denied') {
                    errorMessage = "Sem permissão para acessar o banco de dados.";
                }
                
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        // Listener para mudanças no estado de autenticação
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && !user.isAnonymous) {
                console.log('⚠️ Usuário não é anônimo:', user.uid);
            }
        });

        initializeApp();

        return () => unsubscribe();
    }, []);

    const handleCharacterCreated = async (newCharacter) => {
        if (!user) {
            setError("Usuário não autenticado");
            return;
        }
        
        try {
            // Salva o novo personagem em uma subcoleção do usuário
            const userCharactersCollection = collection(db, "users", user.uid, "characters");
            const docRef = await addDoc(userCharactersCollection, newCharacter);

            // Atualiza o estado com o novo personagem (incluindo o novo ID)
            const characterWithId = { ...newCharacter, id: docRef.id };
            setCharacter(characterWithId);

            setCurrentView('sheet');
            setError(null);
        } catch (error) {
            console.error("Erro ao salvar personagem:", error);
            setError("Erro ao salvar personagem. Tente novamente.");
        }
    };

    const handleSelectCharacter = (selectedCharacter) => {
        setCharacter(selectedCharacter);
        setCurrentView(selectedCharacter ? 'sheet' : 'menu');
        setError(null);
    };

    const handleNewCharacter = () => {
        setCurrentView('create');
        setError(null);
    };

    const handleBackToMenu = () => {
        setCurrentView('menu');
        setError(null);
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div>Invocando magia ancestral...</div>
                    <div style={{ fontSize: '1rem', marginTop: '10px', opacity: 0.8 }}>
                        Conectando aos reinos místicos
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>🏰 Criador de Heróis de D&D</h1>
            
            {/* Navigation Menu */}
            <div className="nav-menu">
                <button 
                    className={`nav-btn ${currentView === 'menu' ? 'active' : ''}`}
                    onClick={handleBackToMenu}
                >
                    📚 Meus Heróis
                </button>
                <button 
                    className={`nav-btn ${currentView === 'create' ? 'active' : ''}`}
                    onClick={handleNewCharacter}
                >
                    ✨ Criar Herói
                </button>
                {character && (
                    <button 
                        className={`nav-btn ${currentView === 'sheet' ? 'active' : ''}`}
                        onClick={() => handleSelectCharacter(character)}
                    >
                        📜 Ver Ficha
                    </button>
                )}
            </div>
            
            {error && (
                <div style={{ 
                    background: 'linear-gradient(135deg, var(--dark-red), #a00000)',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    border: '2px solid #ff4444'
                }}>
                    ⚠️ {error}
                </div>
            )}
            
            {/* Content based on current view */}
            {currentView === 'menu' && (
                <CharacterMenu 
                    user={user}
                    onSelectCharacter={handleSelectCharacter}
                    onNewCharacter={handleNewCharacter}
                    currentCharacter={character}
                />
            )}
            
            {currentView === 'create' && (
                <div>
                    <div style={{ 
                        textAlign: 'center', 
                        marginBottom: '30px',
                        padding: '20px',
                        background: 'rgba(212, 175, 55, 0.1)',
                        borderRadius: '15px',
                        border: '2px solid var(--primary-gold)'
                    }}>
                        <h2 style={{ 
                            color: 'var(--dark-red)', 
                            marginBottom: '15px',
                            fontSize: '1.8rem'
                        }}>
                            ⚔️ Forje seu Destino!
                        </h2>
                        <p style={{ 
                            fontSize: '1.2rem', 
                            color: 'var(--medium-brown)',
                            lineHeight: 1.6,
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Crie um herói épico escolhendo sua linhagem, vocação e atributos divinos.
                            Seu personagem aguarda para embarcar em aventuras legendárias!
                        </p>
                    </div>
                    
                    <CharacterCreator onCharacterCreated={handleCharacterCreated} />
                </div>
            )}
            
            {currentView === 'sheet' && character && (
                <CharacterSheet 
                    character={character} 
                    onNewCharacter={handleNewCharacter} 
                    user={user}
                />
            )}
            
            {/* Welcome message if no character and on menu */}
            {currentView === 'menu' && !character && (
                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '40px',
                    padding: '40px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    borderRadius: '15px',
                    border: '2px solid var(--primary-gold)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏰</div>
                    <h2 style={{ 
                        color: 'var(--dark-red)', 
                        marginBottom: '15px',
                        fontSize: '2.2rem'
                    }}>
                        Bem-vindo ao Reino das Aventuras!
                    </h2>
                    <p style={{ 
                        fontSize: '1.3rem', 
                        color: 'var(--medium-brown)',
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        margin: '0 auto 30px'
                    }}>
                        Adentre um mundo de magia e aventura! Crie heróis épicos, gerencie suas fichas 
                        e prepare-se para jornadas inesquecíveis nos reinos de Dungeons & Dragons.
                    </p>
                    <button 
                        className="btn btn-primary"
                        onClick={handleNewCharacter}
                        style={{ fontSize: '1.2rem', padding: '15px 40px' }}
                    >
                        🌟 Criar Meu Primeiro Herói
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
