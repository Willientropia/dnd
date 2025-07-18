import React, { useState, useEffect } from 'react';
import { db, auth, signInAnonymously } from './services';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import CharacterCreator from './components/CharacterCreator';
import CharacterSheet from './components/CharacterSheet';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const userCredential = await signInAnonymously(auth);
                const uid = userCredential.user.uid;
                setUser(userCredential.user);
                
                // Tenta carregar o personagem existente
                const docRef = doc(db, "characters", uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setCharacter(docSnap.data());
                }
            } catch (error) {
                console.error("Erro ao inicializar:", error);
                setError("Erro ao conectar com o servidor. Verifique sua conexão.");
            } finally {
                setLoading(false);
            }
        };

        initializeApp();
    }, []);

    const handleCharacterCreated = async (newCharacter) => {
        if (!user) {
            setError("Usuário não autenticado");
            return;
        }
        
        try {
            const docRef = doc(db, "characters", user.uid);
            await setDoc(docRef, newCharacter);
            setCharacter(newCharacter);
            setError(null);
        } catch (error) {
            console.error("Erro ao salvar personagem:", error);
            setError("Erro ao salvar personagem. Tente novamente.");
        }
    };

    const handleNewCharacter = async () => {
        if (!user) return;
        
        try {
            // Limpa o personagem atual
            setCharacter(null);
            setError(null);
        } catch (error) {
            console.error("Erro ao criar novo personagem:", error);
            setError("Erro ao criar novo personagem.");
        }
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
            <h1>� Criador de Heróis de D&D</h1>
            
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
            
            {character ? (
                <CharacterSheet 
                    character={character} 
                    onNewCharacter={handleNewCharacter} 
                />
            ) : (
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
                            ⚔️ Bem-vindo ao Reino das Aventuras!
                        </h2>
                        <p style={{ 
                            fontSize: '1.2rem', 
                            color: 'var(--medium-brown)',
                            lineHeight: 1.6,
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Forje seu destino criando um herói épico! 
                            Escolha sua raça, classe e atributos para embarcar em aventuras legendárias.
                        </p>
                    </div>
                    
                    <CharacterCreator onCharacterCreated={handleCharacterCreated} />
                </div>
            )}
        </div>
    );
}

export default App;