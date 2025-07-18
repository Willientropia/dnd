import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services';
import { translateRace, translateClass } from '../services/translations';

function CharacterMenu({ user, onSelectCharacter, onNewCharacter, currentCharacter }) {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCharacters();
    }, [user]);

    const loadCharacters = async () => {
        if (!user) return;
        
        setLoading(true);
        try {
            // Para simplicidade, vamos usar uma subcoleção ou nomear com o UID
            // Por ora, vamos carregar apenas o personagem atual do usuário
            // Em uma implementação completa, você usaria uma subcoleção
            setCharacters(currentCharacter ? [currentCharacter] : []);
        } catch (error) {
            console.error('Erro ao carregar personagens:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCharacter = async (characterId) => {
        if (!confirm('Tem certeza que deseja excluir este personagem?')) return;
        
        try {
            await deleteDoc(doc(db, 'characters', user.uid));
            onSelectCharacter(null);
            loadCharacters();
        } catch (error) {
            console.error('Erro ao excluir personagem:', error);
            alert('Erro ao excluir personagem');
        }
    };

    const calculateLevel = (character) => {
        return character.level || 1;
    };

    const calculateHP = (character) => {
        if (!character.class || !character.abilities) return 10;
        
        const constModifier = Math.floor((character.abilities.Constituição - 10) / 2);
        const hitDie = character.class.hit_dice ? parseInt(character.class.hit_dice.split('d')[1]) : 8;
        const level = calculateLevel(character);
        
        return hitDie + constModifier + (level - 1) * (Math.floor(hitDie / 2) + 1 + constModifier);
    };

    if (loading) {
        return (
            <div className="character-menu">
                <div className="loading">
                    <div>Consultando o livro de heróis...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="character-menu">
            <div className="menu-header">
                <h2 className="menu-title">⚔️ Seus Heróis</h2>
                <button className="btn btn-primary" onClick={onNewCharacter}>
                    ✨ Criar Novo Herói
                </button>
            </div>

            {characters.length === 0 ? (
                <div className="empty-characters">
                    <div className="empty-characters-icon">📜</div>
                    <h3>Nenhum herói criado ainda</h3>
                    <p>Que tal forjar seu primeiro personagem épico?</p>
                </div>
            ) : (
                <div className="characters-grid">
                    {characters.map((character, index) => (
                        <div
                            key={`character-${index}`}
                            className={`character-card ${currentCharacter === character ? 'selected' : ''}`}
                        >
                            <div className="card-character-name">
                                {character.name || 'Herói Sem Nome'}
                            </div>
                            
                            <div className="card-character-info">
                                <span className="card-info-label">Raça:</span>
                                <span className="card-info-value">
                                    {character.race ? translateRace(character.race.slug) : 'N/A'}
                                </span>
                            </div>
                            
                            <div className="card-character-info">
                                <span className="card-info-label">Classe:</span>
                                <span className="card-info-value">
                                    {character.class ? translateClass(character.class.slug) : 'N/A'}
                                </span>
                            </div>
                            
                            <div className="card-character-info">
                                <span className="card-info-label">Nível:</span>
                                <span className="card-info-value">{calculateLevel(character)}</span>
                            </div>
                            
                            <div className="card-character-info">
                                <span className="card-info-label">PV:</span>
                                <span className="card-info-value">{calculateHP(character)}</span>
                            </div>

                            <div className="card-actions">
                                <button 
                                    className="btn btn-small btn-view"
                                    onClick={() => onSelectCharacter(character)}
                                >
                                    👁️ Ver Ficha
                                </button>
                                <button 
                                    className="btn btn-small btn-delete"
                                    onClick={() => handleDeleteCharacter(index)}
                                >
                                    🗑️ Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CharacterMenu;
