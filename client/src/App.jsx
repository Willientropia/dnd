import React, { useState, useEffect } from 'react';
import { db, auth, signInAnonymously } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import CharacterCreator from './components/CharacterCreator';
import CharacterSheet from './components/CharacterSheet';
import './App.css'; // O Vite já importa o CSS

function App() {
    const [user, setUser] = useState(null);
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        signInAnonymously(auth)
            .then(userCredential => {
                const uid = userCredential.user.uid;
                setUser(userCredential.user);
                // Tenta carregar o personagem
                const docRef = doc(db, "characters", uid);
                getDoc(docRef).then(docSnap => {
                    if (docSnap.exists()) {
                        setCharacter(docSnap.data());
                    }
                    setLoading(false);
                });
            })
            .catch(error => console.error("Firebase Auth Error", error));
    }, []);

    const handleCharacterCreated = async (newCharacter) => {
        if (!user) return;
        const docRef = doc(db, "characters", user.uid);
        await setDoc(docRef, newCharacter);
        setCharacter(newCharacter);
    };

    const handleNewCharacter = async () => {
      if (!user) return;
      // Opcional: deletar o personagem antigo do banco
      setCharacter(null);
    }

    if (loading) {
        return <div className="status loading">Conectando e carregando...</div>;
    }

    return (
        <div className="container">
            <h1>🎲 D&D Fichas com React</h1>
            {character ? (
                <CharacterSheet character={character} onNewCharacter={handleNewCharacter} />
            ) : (
                <CharacterCreator onCharacterCreated={handleCharacterCreated} />
            )}
        </div>
    );
}

export default App;