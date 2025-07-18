import React from 'react';
import { translateRace, translateClass, translateDescription, cleanDescription } from '../services/translations';
import './CharacterSheet.css';

function CharacterSheet({ character, onNewCharacter }) {
    const getModifier = (score) => Math.floor((score - 10) / 2);

    const formatModifier = (modifier) => {
        return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    };

    // Calcula o HP baseado na classe e constituição
    const constModifier = getModifier(character.abilities.Constituição);
    const hitDie = character.class?.hit_dice ? parseInt(character.class.hit_dice.split('d')[1]) : 8;
    const hp = hitDie + constModifier + (character.level - 1) * (Math.floor(hitDie / 2) + 1 + constModifier);

    // Calcula a CA (Classe de Armadura) básica
    const dexModifier = getModifier(character.abilities.Destreza);
    const armorClass = 10 + dexModifier;

    // Proficiências básicas baseadas na classe
    const getClassFeatures = () => {
        if (!character.class) return [];
        
        const features = [];
        if (character.class.prof_armor) {
            features.push({
                name: "Proficiência em Armaduras",
                description: character.class.prof_armor
            });
        }
        if (character.class.prof_weapons) {
            features.push({
                name: "Proficiência em Armas",
                description: character.class.prof_weapons
            });
        }
        if (character.class.prof_tools) {
            features.push({
                name: "Proficiência em Ferramentas",
                description: character.class.prof_tools
            });
        }
        return features;
    };

    // Atributos da raça
    const getRaceFeatures = () => {
        if (!character.race) return [];
        
        const features = [];
        if (character.race.traits) {
            features.push({
                name: "Traços Raciais",
                description: character.race.traits
            });
        }
        if (character.race.languages) {
            features.push({
                name: "Idiomas",
                description: character.race.languages
            });
        }
        if (character.race.vision) {
            features.push({
                name: "Visão",
                description: character.race.vision
            });
        }
        return features;
    };

    const allFeatures = [...getClassFeatures(), ...getRaceFeatures()];

    return (
        <div className="character-sheet">
            {/* Header */}
            <div className="character-header">
                <h1 className="character-name">{character.name}</h1>
                <div className="character-level">
                    Nível {character.level} • {character.race ? translateRace(character.race.slug) : 'N/A'} • {character.class ? translateClass(character.class.slug) : 'N/A'}
                </div>
            </div>

            {/* Main Grid */}
            <div className="sheet-grid">
                {/* Sidebar */}
                <div className="character-sidebar">
                    {/* Informações Básicas */}
                    <div className="info-card">
                        <div className="card-title">⚔️ Informações Básicas</div>
                        <div className="info-item">
                            <span className="info-label">Raça</span>
                            <span className="info-value">{character.race ? translateRace(character.race.slug) : 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Classe</span>
                            <span className="info-value">{character.class ? translateClass(character.class.slug) : 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Nível</span>
                            <span className="info-value">{character.level}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Dado de Vida</span>
                            <span className="info-value">{character.class?.hit_dice}</span>
                        </div>
                    </div>

                    {/* HP */}
                    <div className="hp-display">
                        <div className="hp-label">Pontos de Vida</div>
                        <div className="hp-value">{hp}</div>
                        <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                            Máximo: {hp}
                        </div>
                    </div>

                    {/* Defesas */}
                    <div className="info-card">
                        <div className="card-title">🛡️ Defesas</div>
                        <div className="info-item">
                            <span className="info-label">Classe de Armadura</span>
                            <span className="info-value">{armorClass}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Velocidade</span>
                            <span className="info-value">{character.race?.speed?.walk || 30} metros</span>
                        </div>
                        {character.race?.vision && (
                            <div className="info-item">
                                <span className="info-label">Visão</span>
                                <span className="info-value">Visão no Escuro</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="sheet-main">
                    {/* Atributos */}
                    <div className="abilities-section">
                        <h3 className="card-title">🎲 Atributos</h3>
                        <div className="abilities-grid">
                            {Object.entries(character.abilities).map(([name, score]) => {
                                const modifier = getModifier(score);
                                return (
                                    <div key={name} className="ability-block">
                                        <div className="ability-name">{name}</div>
                                        <div className="ability-score">{score}</div>
                                        <div className={`ability-modifier ${modifier >= 0 ? 'positive' : 'negative'}`}>
                                            {formatModifier(modifier)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Características e Habilidades */}
                    {allFeatures.length > 0 && (
                        <div className="features-section">
                            <h3 className="card-title">✨ Características & Habilidades</h3>
                            <div className="features-grid">
                                {allFeatures.map((feature, index) => (
                                    <div key={index} className="feature-item">
                                        <div className="feature-name">{feature.name}</div>
                                        <div 
                                            className="feature-description"
                                            dangerouslySetInnerHTML={{ 
                                                __html: feature.description?.substring(0, 200) + 
                                                        (feature.description?.length > 200 ? '...' : '') 
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Equipamentos Básicos */}
                    <div className="equipment-section">
                        <h3 className="card-title">🎒 Equipamentos Iniciais</h3>
                        <div className="equipment-grid">
                            <div className="equipment-item">Mochila de Aventureiro</div>
                            <div className="equipment-item">Armadura de Couro</div>
                            <div className="equipment-item">Arma Simples</div>
                            <div className="equipment-item">Kit de Exploração</div>
                            <div className="equipment-item">50 moedas de ouro</div>
                            <div className="equipment-item">Ração (10 dias)</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="sheet-actions">
                <button className="btn btn-secondary" onClick={onNewCharacter}>
                    🔄 Criar Novo Personagem
                </button>
                <button className="btn btn-primary" onClick={() => window.print()}>
                    🖨️ Imprimir Ficha
                </button>
            </div>
        </div>
    );
}

export default CharacterSheet;