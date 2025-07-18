import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services';
import { translateRace, translateClass } from '../services/translations';
import './CharacterSheet.css';

function CharacterSheet({ character: initialCharacter, onNewCharacter, user }) {
    const [character, setCharacter] = useState(initialCharacter);
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('main');

    // Auto-save quando o personagem muda
    useEffect(() => {
        const saveCharacter = async () => {
            if (!user || !character) return;
            
            try {
                const docRef = doc(db, 'characters', user.uid);
                await updateDoc(docRef, character);
            } catch (error) {
                console.error('Erro ao salvar:', error);
            }
        };

        const timeoutId = setTimeout(saveCharacter, 1000);
        return () => clearTimeout(timeoutId);
    }, [character, user]);

    const getModifier = (score) => Math.floor((score - 10) / 2);
    const formatModifier = (modifier) => modifier >= 0 ? `+${modifier}` : `${modifier}`;

    const getProficiencyBonus = () => Math.ceil(character.level / 4) + 1;

    const getSkillModifier = (skill) => {
        const abilityMap = {
            'Acrobacia': 'Destreza',
            'Arcanismo': 'Inteligência',
            'Atletismo': 'Força',
            'Atuação': 'Carisma',
            'Blefe': 'Carisma',
            'Furtividade': 'Destreza',
            'História': 'Inteligência',
            'Intimidação': 'Carisma',
            'Intuição': 'Sabedoria',
            'Investigação': 'Inteligência',
            'Lidar com Animais': 'Sabedoria',
            'Medicina': 'Sabedoria',
            'Natureza': 'Inteligência',
            'Percepção': 'Sabedoria',
            'Persuasão': 'Carisma',
            'Prestidigitação': 'Destreza',
            'Religião': 'Inteligência',
            'Sobrevivência': 'Sabedoria'
        };
        
        const ability = abilityMap[skill];
        const abilityMod = getModifier(character.abilities[ability]);
        const proficient = character.skills[skill] || false;
        
        return abilityMod + (proficient ? getProficiencyBonus() : 0);
    };

    const updateCharacter = (updates) => {
        setCharacter(prev => ({ ...prev, ...updates }));
    };

    const updateHP = (type, value) => {
        const newHP = { ...character.hitPoints };
        newHP[type] = Math.max(0, parseInt(value) || 0);
        
        if (type === 'current') {
            newHP.current = Math.min(newHP.current, newHP.max + newHP.temporary);
        }
        
        updateCharacter({ hitPoints: newHP });
    };

    const levelUp = () => {
        const newLevel = character.level + 1;
        const constMod = getModifier(character.abilities.Constituição);
        const hitDie = character.class?.hit_dice ? parseInt(character.class.hit_dice.split('d')[1]) : 8;
        const hpIncrease = Math.floor(hitDie / 2) + 1 + constMod;
        
        updateCharacter({
            level: newLevel,
            hitPoints: {
                ...character.hitPoints,
                max: character.hitPoints.max + hpIncrease,
                current: character.hitPoints.current + hpIncrease
            },
            proficiencyBonus: getProficiencyBonus()
        });
    };

    const toggleSpellSlot = (level, increment = true) => {
        const newUsedSlots = { ...character.usedSpellSlots };
        if (increment) {
            newUsedSlots[`level${level}`] = Math.min(
                newUsedSlots[`level${level}`] + 1,
                character.spellSlots[`level${level}`]
            );
        } else {
            newUsedSlots[`level${level}`] = Math.max(0, newUsedSlots[`level${level}`] - 1);
        }
        updateCharacter({ usedSpellSlots: newUsedSlots });
    };

    const restoreSpellSlots = () => {
        const resetSlots = {};
        Object.keys(character.spellSlots).forEach(key => {
            resetSlots[key] = 0;
        });
        updateCharacter({ usedSpellSlots: resetSlots });
    };

    const takeDamage = (amount) => {
        const damage = parseInt(amount) || 0;
        let newCurrent = character.hitPoints.current;
        let newTemp = character.hitPoints.temporary;
        
        if (newTemp > 0) {
            if (damage <= newTemp) {
                newTemp -= damage;
            } else {
                const remainingDamage = damage - newTemp;
                newTemp = 0;
                newCurrent = Math.max(0, newCurrent - remainingDamage);
            }
        } else {
            newCurrent = Math.max(0, newCurrent - damage);
        }
        
        updateCharacter({
            hitPoints: {
                ...character.hitPoints,
                current: newCurrent,
                temporary: newTemp
            }
        });
    };

    const heal = (amount) => {
        const healing = parseInt(amount) || 0;
        const newCurrent = Math.min(
            character.hitPoints.current + healing,
            character.hitPoints.max
        );
        
        updateCharacter({
            hitPoints: {
                ...character.hitPoints,
                current: newCurrent
            }
        });
    };

    if (!character) return null;

    return (
        <div className="character-sheet-container">
            {/* Header */}
            <div className="sheet-header">
                <div className="character-title">
                    {editMode ? (
                        <input 
                            className="name-input"
                            value={character.name}
                            onChange={e => updateCharacter({ name: e.target.value })}
                            onBlur={() => setEditMode(false)}
                            autoFocus
                        />
                    ) : (
                        <h1 onClick={() => setEditMode(true)}>{character.name}</h1>
                    )}
                </div>
                <div className="character-subtitle">
                    Nível {character.level} {character.race ? translateRace(character.race.slug) : ''} {character.class ? translateClass(character.class.slug) : ''}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="sheet-nav">
                <button 
                    className={`nav-tab ${activeTab === 'main' ? 'active' : ''}`}
                    onClick={() => setActiveTab('main')}
                >
                    Principal
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'spells' ? 'active' : ''}`}
                    onClick={() => setActiveTab('spells')}
                >
                    Magias
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'equipment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('equipment')}
                >
                    Equipamentos
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'notes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notes')}
                >
                    Anotações
                </button>
            </div>

            {/* Main Tab */}
            {activeTab === 'main' && (
                <div className="sheet-content">
                    <div className="sheet-grid">
                        {/* Left Column */}
                        <div className="left-column">
                            {/* Basic Info */}
                            <div className="info-section">
                                <div className="info-row">
                                    <div className="info-item">
                                        <label>Antecedente</label>
                                        <div className="info-value">{character.background}</div>
                                    </div>
                                    <div className="info-item">
                                        <label>Alinhamento</label>
                                        <div className="info-value">{character.alignment}</div>
                                    </div>
                                    <div className="info-item">
                                        <label>Experiência</label>
                                        <input 
                                            type="number"
                                            value={character.experience}
                                            onChange={e => updateCharacter({ experience: parseInt(e.target.value) || 0 })}
                                            className="exp-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Abilities */}
                            <div className="abilities-section">
                                <h3>Atributos</h3>
                                <div className="abilities-grid">
                                    {Object.entries(character.abilities).map(([name, score]) => {
                                        const modifier = getModifier(score);
                                        return (
                                            <div key={name} className="ability-block">
                                                <div className="ability-name">{name}</div>
                                                <div className="ability-score">{score}</div>
                                                <div className="ability-modifier">
                                                    {formatModifier(modifier)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Saving Throws */}
                            <div className="saves-section">
                                <h3>Testes de Resistência</h3>
                                {Object.keys(character.abilities).map(ability => {
                                    const modifier = getModifier(character.abilities[ability]);
                                    const proficient = character.savingThrows[ability];
                                    const total = modifier + (proficient ? getProficiencyBonus() : 0);
                                    
                                    return (
                                        <div key={ability} className="save-item">
                                            <input 
                                                type="checkbox"
                                                checked={proficient || false}
                                                onChange={e => updateCharacter({
                                                    savingThrows: {
                                                        ...character.savingThrows,
                                                        [ability]: e.target.checked
                                                    }
                                                })}
                                            />
                                            <span className="save-bonus">{formatModifier(total)}</span>
                                            <span className="save-name">{ability}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Skills */}
                            <div className="skills-section">
                                <h3>Perícias</h3>
                                {[
                                    'Acrobacia', 'Arcanismo', 'Atletismo', 'Atuação', 'Blefe', 'Furtividade',
                                    'História', 'Intimidação', 'Intuição', 'Investigação', 'Lidar com Animais',
                                    'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação',
                                    'Religião', 'Sobrevivência'
                                ].map(skill => {
                                    const modifier = getSkillModifier(skill);
                                    const proficient = character.skills[skill];
                                    
                                    return (
                                        <div key={skill} className="skill-item">
                                            <input 
                                                type="checkbox"
                                                checked={proficient || false}
                                                onChange={e => updateCharacter({
                                                    skills: {
                                                        ...character.skills,
                                                        [skill]: e.target.checked
                                                    }
                                                })}
                                            />
                                            <span className="skill-bonus">{formatModifier(modifier)}</span>
                                            <span className="skill-name">{skill}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="right-column">
                            {/* Combat Stats */}
                            <div className="combat-section">
                                <div className="combat-stats">
                                    <div className="stat-block">
                                        <label>Classe de Armadura</label>
                                        <input 
                                            type="number"
                                            value={character.armorClass}
                                            onChange={e => updateCharacter({ armorClass: parseInt(e.target.value) || 10 })}
                                            className="ac-input"
                                        />
                                    </div>
                                    <div className="stat-block">
                                        <label>Iniciativa</label>
                                        <div className="stat-value">
                                            {formatModifier(getModifier(character.abilities.Destreza))}
                                        </div>
                                    </div>
                                    <div className="stat-block">
                                        <label>Velocidade</label>
                                        <input 
                                            type="number"
                                            value={character.speed}
                                            onChange={e => updateCharacter({ speed: parseInt(e.target.value) || 30 })}
                                            className="speed-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hit Points */}
                            <div className="hp-section">
                                <h3>Pontos de Vida</h3>
                                <div className="hp-grid">
                                    <div className="hp-max">
                                        <label>Máximo</label>
                                        <input 
                                            type="number"
                                            value={character.hitPoints.max}
                                            onChange={e => updateHP('max', e.target.value)}
                                        />
                                    </div>
                                    <div className="hp-current">
                                        <label>Atual</label>
                                        <input 
                                            type="number"
                                            value={character.hitPoints.current}
                                            onChange={e => updateHP('current', e.target.value)}
                                            className="hp-current-input"
                                        />
                                    </div>
                                    <div className="hp-temp">
                                        <label>Temporário</label>
                                        <input 
                                            type="number"
                                            value={character.hitPoints.temporary}
                                            onChange={e => updateHP('temporary', e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="hp-controls">
                                    <button 
                                        className="damage-btn"
                                        onClick={() => {
                                            const amount = prompt('Quantidade de dano:');
                                            if (amount) takeDamage(amount);
                                        }}
                                    >
                                        Receber Dano
                                    </button>
                                    <button 
                                        className="heal-btn"
                                        onClick={() => {
                                            const amount = prompt('Quantidade de cura:');
                                            if (amount) heal(amount);
                                        }}
                                    >
                                        Curar
                                    </button>
                                </div>
                                
                                <div className="hp-bar">
                                    <div 
                                        className="hp-fill"
                                        style={{ 
                                            width: `${(character.hitPoints.current / character.hitPoints.max) * 100}%`,
                                            backgroundColor: character.hitPoints.current > character.hitPoints.max * 0.5 ? '#28a745' : 
                                                           character.hitPoints.current > character.hitPoints.max * 0.25 ? '#ffc107' : '#dc3545'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Level Controls */}
                            <div className="level-section">
                                <div className="level-display">
                                    <span>Nível {character.level}</span>
                                    <button 
                                        className="level-up-btn"
                                        onClick={levelUp}
                                    >
                                        Subir de Nível
                                    </button>
                                </div>
                                <div className="proficiency-bonus">
                                    Bônus de Proficiência: +{getProficiencyBonus()}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="features-section">
                                <h3>Características e Traços</h3>
                                <div className="features-list">
                                    {character.features && character.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <h4>{feature.name}</h4>
                                            <p>{feature.description}</p>
                                        </div>
                                    ))}
                                    
                                    {/* Default class features */}
                                    {character.class && (
                                        <div className="feature-item">
                                            <h4>Proficiências da Classe</h4>
                                            <p>
                                                <strong>Armaduras:</strong> {character.class.prof_armor}<br/>
                                                <strong>Armas:</strong> {character.class.prof_weapons}<br/>
                                                <strong>Testes de Resistência:</strong> {character.class.prof_saving_throws}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Spells Tab */}
            {activeTab === 'spells' && (
                <div className="spells-content">
                    <div className="spells-header">
                        <h3>Magias</h3>
                        <button 
                            className="rest-btn"
                            onClick={restoreSpellSlots}
                        >
                            Descanso Longo
                        </button>
                    </div>

                    {/* Spell Slots */}
                    <div className="spell-slots-section">
                        <h4>Espaços de Magia</h4>
                        <div className="spell-slots-grid">
                            {[1,2,3,4,5,6,7,8,9].map(level => {
                                const totalSlots = character.spellSlots[`level${level}`] || 0;
                                const usedSlots = character.usedSpellSlots[`level${level}`] || 0;
                                
                                if (totalSlots === 0) return null;
                                
                                return (
                                    <div key={level} className="spell-level-block">
                                        <div className="spell-level-header">
                                            <span>Nível {level}</span>
                                            <span>{totalSlots - usedSlots}/{totalSlots}</span>
                                        </div>
                                        <div className="spell-slots">
                                            {Array.from({ length: totalSlots }, (_, i) => (
                                                <button
                                                    key={i}
                                                    className={`spell-slot ${i < usedSlots ? 'used' : 'available'}`}
                                                    onClick={() => toggleSpellSlot(level, i >= usedSlots)}
                                                >
                                                    ○
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Known Spells */}
                    <div className="known-spells-section">
                        <h4>Magias Conhecidas</h4>
                        
                        {/* Cantrips */}
                        {character.spells.cantrips.length > 0 && (
                            <div className="spell-level-group">
                                <h5>Truques</h5>
                                <div className="spells-list">
                                    {character.spells.cantrips.map((spell, index) => (
                                        <div key={index} className="spell-card">
                                            <div className="spell-header">
                                                <h6>{spell.name}</h6>
                                                <span className="spell-school">{spell.school}</span>
                                            </div>
                                            <div className="spell-details">
                                                <p><strong>Tempo:</strong> {spell.casting_time}</p>
                                                <p><strong>Alcance:</strong> {spell.range}</p>
                                                <p><strong>Duração:</strong> {spell.duration}</p>
                                            </div>
                                            <div className="spell-description">
                                                {spell.desc}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Level Spells */}
                        {[1,2,3,4,5,6,7,8,9].map(level => {
                            const levelSpells = character.spells[`level${level}`] || [];
                            if (levelSpells.length === 0) return null;
                            
                            return (
                                <div key={level} className="spell-level-group">
                                    <h5>Nível {level}</h5>
                                    <div className="spells-list">
                                        {levelSpells.map((spell, index) => (
                                            <div key={index} className="spell-card">
                                                <div className="spell-header">
                                                    <h6>{spell.name}</h6>
                                                    <span className="spell-school">{spell.school}</span>
                                                </div>
                                                <div className="spell-details">
                                                    <p><strong>Tempo:</strong> {spell.casting_time}</p>
                                                    <p><strong>Alcance:</strong> {spell.range}</p>
                                                    <p><strong>Duração:</strong> {spell.duration}</p>
                                                </div>
                                                <div className="spell-description">
                                                    {spell.desc}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Equipment Tab */}
            {activeTab === 'equipment' && (
                <div className="equipment-content">
                    <h3>Equipamentos</h3>
                    
                    <div className="equipment-section">
                        <h4>Inventário</h4>
                        <div className="equipment-list">
                            {character.equipment && character.equipment.map((item, index) => (
                                <div key={index} className="equipment-item">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-quantity">{item.quantity || 1}</span>
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            className="add-equipment-btn"
                            onClick={() => {
                                const itemName = prompt('Nome do item:');
                                if (itemName) {
                                    const newEquipment = [...(character.equipment || []), { name: itemName, quantity: 1 }];
                                    updateCharacter({ equipment: newEquipment });
                                }
                            }}
                        >
                            Adicionar Item
                        </button>
                    </div>
                </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
                <div className="notes-content">
                    <h3>Anotações</h3>
                    <textarea
                        value={character.notes || ''}
                        onChange={e => updateCharacter({ notes: e.target.value })}
                        placeholder="Adicione suas anotações, história do personagem, etc..."
                        className="notes-textarea"
                    />
                </div>
            )}

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