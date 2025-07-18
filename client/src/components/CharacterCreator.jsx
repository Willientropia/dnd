import React, { useState, useEffect } from 'react';
import { fetchData } from '../services';
import { translateRace, translateClass, cleanDescription, translateDescription } from '../services/translations';
import './CharacterCreator.css';

function CharacterCreator({ onCharacterCreated }) {
    const [step, setStep] = useState(1);
    const [races, setRaces] = useState([]);
    const [classes, setClasses] = useState([]);
    const [spells, setSpells] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [character, setCharacter] = useState({
        name: '',
        race: null,
        class: null,
        background: '',
        alignment: 'Neutro',
        level: 1,
        experience: 0,
        abilities: {
            'Força': 10,
            'Destreza': 10,
            'Constituição': 10,
            'Inteligência': 10,
            'Sabedoria': 10,
            'Carisma': 10
        },
        skills: {},
        savingThrows: {},
        hitPoints: {
            max: 0,
            current: 0,
            temporary: 0
        },
        armorClass: 10,
        initiative: 0,
        speed: 30,
        proficiencyBonus: 2,
        languages: [],
        proficiencies: [],
        equipment: [],
        spells: {
            cantrips: [],
            level1: [],
            level2: [],
            level3: [],
            level4: [],
            level5: [],
            level6: [],
            level7: [],
            level8: [],
            level9: []
        },
        spellSlots: {
            level1: 0,
            level2: 0,
            level3: 0,
            level4: 0,
            level5: 0,
            level6: 0,
            level7: 0,
            level8: 0,
            level9: 0
        },
        usedSpellSlots: {
            level1: 0,
            level2: 0,
            level3: 0,
            level4: 0,
            level5: 0,
            level6: 0,
            level7: 0,
            level8: 0,
            level9: 0
        },
        features: [],
        notes: ''
    });

    const [abilityMethod, setAbilityMethod] = useState('pointBuy'); // 'pointBuy', 'roll', 'standard'
    const [pointBuyPoints, setPointBuyPoints] = useState(27);
    const [selectedEquipment, setSelectedEquipment] = useState([]);

    const standardArray = [15, 14, 13, 12, 10, 8];
    const backgroundOptions = [
        'Acolyte', 'Criminal', 'Folk Hero', 'Noble', 'Sage', 'Soldier',
        'Charlatan', 'Entertainer', 'Guild Artisan', 'Hermit', 'Outlander', 'Sailor'
    ];
    
    const alignmentOptions = [
        'Leal e Bom', 'Neutro e Bom', 'Caótico e Bom',
        'Leal e Neutro', 'Neutro', 'Caótico e Neutro',
        'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau'
    ];

    const skillsList = [
        'Acrobacia', 'Arcanismo', 'Atletismo', 'Atuação', 'Blefe', 'Furtividade',
        'História', 'Intimidação', 'Intuição', 'Investigação', 'Lidar com Animais',
        'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação',
        'Religião', 'Sobrevivência'
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [racesData, classesData, spellsData, equipmentData] = await Promise.all([
                    fetchData('races'),
                    fetchData('classes'),
                    fetchData('spells'),
                    fetchData('equipment')
                ]);
                setRaces(racesData);
                setClasses(classesData);
                setSpells(spellsData);
                setEquipment(equipmentData);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Atualiza HP quando constituição ou nível mudam
    useEffect(() => {
        calculateHitPoints();
    }, [character.abilities.Constituição, character.level, character.class]);

    const getModifier = (score) => Math.floor((score - 10) / 2);

    const getPointBuyCost = (score) => {
        if (score <= 13) return score - 8;
        if (score === 14) return 7;
        if (score === 15) return 9;
        return 0;
    };

    const calculateTotalPointBuy = () => {
        return Object.values(character.abilities).reduce((total, score) => {
            return total + getPointBuyCost(score);
        }, 0);
    };

    const calculateHitPoints = () => {
        if (!character.class) return;
        
        const constModifier = getModifier(character.abilities.Constituição);
        const hitDie = character.class.hit_dice ? parseInt(character.class.hit_dice.split('d')[1]) : 8;
        const baseHP = hitDie + constModifier;
        const levelHP = (character.level - 1) * (Math.floor(hitDie / 2) + 1 + constModifier);
        const maxHP = Math.max(baseHP + levelHP, character.level);
        
        setCharacter(prev => ({
            ...prev,
            hitPoints: {
                ...prev.hitPoints,
                max: maxHP,
                current: prev.hitPoints.current === 0 ? maxHP : prev.hitPoints.current
            }
        }));
    };

    const rollAbilities = () => {
        const newAbilities = {};
        Object.keys(character.abilities).forEach(name => {
            const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => b - a).pop();
            newAbilities[name] = rolls.reduce((sum, val) => sum + val, 0);
        });
        setCharacter(prev => ({ ...prev, abilities: newAbilities }));
    };

    const assignStandardArray = () => {
        const abilityNames = Object.keys(character.abilities);
        const newAbilities = {};
        abilityNames.forEach((name, index) => {
            newAbilities[name] = standardArray[index] || 10;
        });
        setCharacter(prev => ({ ...prev, abilities: newAbilities }));
    };

    const handleAbilityChange = (abilityName, value) => {
        if (abilityMethod === 'pointBuy') {
            const newValue = Math.max(8, Math.min(15, parseInt(value)));
            setCharacter(prev => ({
                ...prev,
                abilities: {
                    ...prev.abilities,
                    [abilityName]: newValue
                }
            }));
        }
    };

    const applyRacialBonuses = () => {
        if (!character.race) return character.abilities;
        
        const abilities = { ...character.abilities };
        // Aqui você implementaria os bônus raciais específicos
        // Por exemplo, elfos ganham +2 Destreza
        return abilities;
    };

    const getSpellsForClass = (className, level) => {
        return spells.filter(spell => {
            return spell.dnd_class && spell.dnd_class.includes(className) && 
                   spell.level <= level;
        });
    };

    const canProceedToStep = (stepNumber) => {
        switch(stepNumber) {
            case 2:
                return character.race && character.class;
            case 3:
                return Object.values(character.abilities).every(score => score >= 8 && score <= 15);
            case 4:
                return character.background && character.alignment;
            case 5:
                return true; // Skills são opcionais
            case 6:
                return true; // Equipment pode ser padrão
            default:
                return true;
        }
    };

    const handleFinish = () => {
        if (!character.name || !character.race || !character.class) {
            alert("Por favor, preencha todos os campos obrigatórios!");
            return;
        }
        
        // Aplica bônus raciais finais
        const finalAbilities = applyRacialBonuses();
        const finalCharacter = {
            ...character,
            abilities: finalAbilities,
            createdAt: new Date().toISOString()
        };
        
        onCharacterCreated(finalCharacter);
    };

    const getProgressWidth = () => `${(step / 7) * 100}%`;

    if (loading) {
        return (
            <div className="character-creator">
                <div className="loading">
                    <div>Carregando dados do reino...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="character-creator">
            {/* Progress indicator */}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: getProgressWidth() }}></div>
            </div>

            {/* Step indicators */}
            <div className="step-indicator">
                {[1,2,3,4,5,6,7].map(num => (
                    <div key={num} className={`step-dot ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}></div>
                ))}
            </div>

            {/* Passo 1: Raça e Classe */}
            {step === 1 && (
                <div className="creator-step slide-in-left">
                    <h2>🏰 Escolha sua Linhagem e Vocação</h2>
                    <div className="two-column">
                        <div className="form-group">
                            <label className="form-label">🧝‍♀️ Raça</label>
                            <select 
                                value={character.race?.slug || ''} 
                                onChange={e => {
                                    const race = races.find(r => r.slug === e.target.value);
                                    setCharacter(prev => ({ ...prev, race }));
                                }}
                            >
                                <option value="">Selecione uma Raça</option>
                                {races.map(r => (
                                    <option key={r.slug} value={r.slug}>
                                        {translateRace(r.slug)}
                                    </option>
                                ))}
                            </select>
                            {character.race && (
                                <div className="selection-info">
                                    <h4>{translateRace(character.race.slug)}</h4>
                                    <p>{cleanDescription(character.race.desc?.substring(0, 200))}</p>
                                    <p><strong>Velocidade:</strong> {character.race.speed?.walk || 30} metros</p>
                                    <p><strong>Tamanho:</strong> {character.race.size_raw || 'Médio'}</p>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">⚔️ Classe</label>
                            <select 
                                value={character.class?.slug || ''} 
                                onChange={e => {
                                    const classData = classes.find(c => c.slug === e.target.value);
                                    setCharacter(prev => ({ ...prev, class: classData }));
                                }}
                            >
                                <option value="">Selecione uma Classe</option>
                                {classes.map(c => (
                                    <option key={c.slug} value={c.slug}>
                                        {translateClass(c.slug)}
                                    </option>
                                ))}
                            </select>
                            {character.class && (
                                <div className="selection-info">
                                    <h4>{translateClass(character.class.slug)}</h4>
                                    <p><strong>Dado de Vida:</strong> {character.class.hit_dice}</p>
                                    <p><strong>Proficiências:</strong> {character.class.prof_weapons}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setStep(2)}
                            disabled={!canProceedToStep(2)}
                        >
                            Próximo: Atributos 🎲
                        </button>
                    </div>
                </div>
            )}

            {/* Passo 2: Método de Geração de Atributos */}
            {step === 2 && (
                <div className="creator-step slide-in-right">
                    <h2>🎲 Método de Geração de Atributos</h2>
                    
                    <div className="method-selection">
                        <div className="method-option">
                            <input 
                                type="radio" 
                                id="pointBuy" 
                                name="abilityMethod" 
                                value="pointBuy"
                                checked={abilityMethod === 'pointBuy'}
                                onChange={e => setAbilityMethod(e.target.value)}
                            />
                            <label htmlFor="pointBuy">
                                <strong>Compra de Pontos</strong> - 27 pontos para distribuir (Recomendado)
                            </label>
                        </div>
                        
                        <div className="method-option">
                            <input 
                                type="radio" 
                                id="standard" 
                                name="abilityMethod" 
                                value="standard"
                                checked={abilityMethod === 'standard'}
                                onChange={e => setAbilityMethod(e.target.value)}
                            />
                            <label htmlFor="standard">
                                <strong>Array Padrão</strong> - [15, 14, 13, 12, 10, 8]
                            </label>
                        </div>
                        
                        <div className="method-option">
                            <input 
                                type="radio" 
                                id="roll" 
                                name="abilityMethod" 
                                value="roll"
                                checked={abilityMethod === 'roll'}
                                onChange={e => setAbilityMethod(e.target.value)}
                            />
                            <label htmlFor="roll">
                                <strong>Rolar Dados</strong> - 4d6, descarta o menor
                            </label>
                        </div>
                    </div>

                    {abilityMethod === 'pointBuy' && (
                        <div>
                            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
                                Pontos restantes: <strong>{27 - calculateTotalPointBuy()}</strong>
                            </p>
                            <div className="abilities-grid">
                                {Object.entries(character.abilities).map(([name, score]) => (
                                    <div key={name} className="ability-card">
                                        <div className="ability-name">{name}</div>
                                        <div className="ability-controls">
                                            <button 
                                                onClick={() => handleAbilityChange(name, score - 1)}
                                                disabled={score <= 8 || (score > 13 && calculateTotalPointBuy() >= 27)}
                                            >
                                                -
                                            </button>
                                            <span className="ability-score">{score}</span>
                                            <button 
                                                onClick={() => handleAbilityChange(name, score + 1)}
                                                disabled={score >= 15 || calculateTotalPointBuy() >= 27}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="ability-modifier">
                                            {getModifier(score) >= 0 ? '+' : ''}{getModifier(score)}
                                        </div>
                                        <div className="point-cost">
                                            Custo: {getPointBuyCost(score)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {abilityMethod === 'standard' && (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <button className="btn btn-secondary" onClick={assignStandardArray}>
                                    Aplicar Array Padrão
                                </button>
                            </div>
                            <div className="abilities-grid">
                                {Object.entries(character.abilities).map(([name, score]) => (
                                    <div key={name} className="ability-card">
                                        <div className="ability-name">{name}</div>
                                        <div className="ability-score">{score}</div>
                                        <div className="ability-modifier">
                                            {getModifier(score) >= 0 ? '+' : ''}{getModifier(score)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {abilityMethod === 'roll' && (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <button className="btn btn-secondary" onClick={rollAbilities}>
                                    🎲 Rolar Atributos
                                </button>
                            </div>
                            <div className="abilities-grid">
                                {Object.entries(character.abilities).map(([name, score]) => (
                                    <div key={name} className="ability-card">
                                        <div className="ability-name">{name}</div>
                                        <div className="ability-score">{score}</div>
                                        <div className="ability-modifier">
                                            {getModifier(score) >= 0 ? '+' : ''}{getModifier(score)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button className="btn btn-primary" onClick={() => setStep(3)}>
                            Próximo: Antecedente 📜
                        </button>
                    </div>
                </div>
            )}

            {/* Passo 3: Antecedente e Alinhamento */}
            {step === 3 && (
                <div className="creator-step slide-in-left">
                    <h2>📜 Antecedente e Alinhamento</h2>
                    
                    <div className="two-column">
                        <div className="form-group">
                            <label className="form-label">📚 Antecedente</label>
                            <select 
                                value={character.background} 
                                onChange={e => setCharacter(prev => ({ ...prev, background: e.target.value }))}
                            >
                                <option value="">Selecione um Antecedente</option>
                                {backgroundOptions.map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">⚖️ Alinhamento</label>
                            <select 
                                value={character.alignment} 
                                onChange={e => setCharacter(prev => ({ ...prev, alignment: e.target.value }))}
                            >
                                {alignmentOptions.map(alignment => (
                                    <option key={alignment} value={alignment}>{alignment}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button className="btn btn-primary" onClick={() => setStep(4)}>
                            Próximo: Perícias 🎯
                        </button>
                    </div>
                </div>
            )}

            {/* Passo 4: Perícias */}
            {step === 4 && (
                <div className="creator-step slide-in-right">
                    <h2>🎯 Seleção de Perícias</h2>
                    <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                        Selecione suas perícias proficientes baseadas na sua classe
                    </p>
                    
                    <div className="skills-selection">
                        {skillsList.map(skill => (
                            <div key={skill} className="skill-option">
                                <input 
                                    type="checkbox" 
                                    id={skill}
                                    checked={character.skills[skill] || false}
                                    onChange={e => {
                                        setCharacter(prev => ({
                                            ...prev,
                                            skills: {
                                                ...prev.skills,
                                                [skill]: e.target.checked
                                            }
                                        }));
                                    }}
                                />
                                <label htmlFor={skill}>{skill}</label>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button className="btn btn-primary" onClick={() => setStep(5)}>
                            Próximo: Equipamentos ⚔️
                        </button>
                    </div>
                </div>
            )}

            {/* Passo 5: Equipamentos */}
            {step === 5 && (
                <div className="creator-step slide-in-left">
                    <h2>⚔️ Equipamentos Iniciais</h2>
                    
                    <div className="equipment-selection">
                        <h3>Equipamentos da Classe</h3>
                        <div className="equipment-grid">
                            {/* Aqui você listaria os equipamentos baseados na classe */}
                            <div className="equipment-item">
                                <input type="checkbox" id="leather-armor" />
                                <label htmlFor="leather-armor">Armadura de Couro</label>
                            </div>
                            <div className="equipment-item">
                                <input type="checkbox" id="simple-weapon" />
                                <label htmlFor="simple-weapon">Arma Simples</label>
                            </div>
                            <div className="equipment-item">
                                <input type="checkbox" id="explorer-pack" />
                                <label htmlFor="explorer-pack">Kit do Explorador</label>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button className="btn btn-primary" onClick={() => setStep(6)}>
                            Próximo: Magias ✨
                        </button>
                    </div>
                </div>
            )}

            {/* Passo 6: Magias (se aplicável) */}
            {step === 6 && (
                <div className="creator-step slide-in-right">
                    <h2>✨ Seleção de Magias</h2>
                    
                    {character.class && ['wizard', 'sorcerer', 'warlock', 'bard', 'cleric', 'druid'].includes(character.class.slug) ? (
                        <div>
                            <p>Sua classe tem acesso a magias! Selecione suas magias iniciais:</p>
                            
                            <div className="spells-selection">
                                <h3>Truques (Cantrips)</h3>
                                <div className="spells-grid">
                                    {getSpellsForClass(character.class.slug, 0).slice(0, 6).map(spell => (
                                        <div key={spell.slug} className="spell-option">
                                            <input 
                                                type="checkbox" 
                                                id={spell.slug}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setCharacter(prev => ({
                                                            ...prev,
                                                            spells: {
                                                                ...prev.spells,
                                                                cantrips: [...prev.spells.cantrips, spell]
                                                            }
                                                        }));
                                                    }
                                                }}
                                            />
                                            <label htmlFor={spell.slug}>
                                                <strong>{spell.name}</strong>
                                                <p>{spell.desc?.substring(0, 100)}...</p>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <p>Sua classe não possui magias no 1º nível.</p>
                        </div>
                    )}
                    
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button className="btn btn-primary" onClick={() => setStep(7)}>
                            Finalizar: Nome ⭐
                        </button>
                    </div>
                </div>
            )}

            {/* Passo 7: Nome e Finalização */}
            {step === 7 && (
                <div className="creator-step slide-in-left">
                    <h2>⭐ Finalize seu Herói</h2>
                    
                    <div className="form-group">
                        <label className="form-label">⚡ Nome do Personagem</label>
                        <input 
                            type="text" 
                            placeholder="Digite o nome do seu herói..." 
                            value={character.name}
                            onChange={e => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                            style={{ textAlign: 'center', fontSize: '1.2rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">📝 Anotações</label>
                        <textarea 
                            placeholder="Adicione uma história ou anotações sobre seu personagem..."
                            value={character.notes}
                            onChange={e => setCharacter(prev => ({ ...prev, notes: e.target.value }))}
                            rows="4"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--light-brown)' }}
                        />
                    </div>

                    {/* Resumo Final */}
                    <div className="character-summary">
                        <h3>📊 Resumo do Personagem</h3>
                        <div className="summary-grid">
                            <div><strong>Nome:</strong> {character.name || 'Não definido'}</div>
                            <div><strong>Raça:</strong> {character.race ? translateRace(character.race.slug) : 'N/A'}</div>
                            <div><strong>Classe:</strong> {character.class ? translateClass(character.class.slug) : 'N/A'}</div>
                            <div><strong>Antecedente:</strong> {character.background || 'N/A'}</div>
                            <div><strong>Alinhamento:</strong> {character.alignment}</div>
                            <div><strong>Nível:</strong> {character.level}</div>
                        </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button className="btn btn-primary" onClick={handleFinish}>
                            🏆 Criar Personagem
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CharacterCreator;