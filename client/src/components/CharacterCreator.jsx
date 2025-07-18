import React, { useState, useEffect } from 'react';
import { fetchData } from '../services';
import { translateRace, translateClass, cleanDescription, translateDescription } from '../services/translations';
import './CharacterCreator.css';

function CharacterCreator({ onCharacterCreated }) {
    const [step, setStep] = useState(1);
    const [races, setRaces] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [character, setCharacter] = useState({
        name: '',
        race: null,
        class: null,
        abilities: {},
        level: 1
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [racesData, classesData] = await Promise.all([
                    fetchData('races'),
                    fetchData('classes')
                ]);
                setRaces(racesData);
                setClasses(classesData);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    
    const rollAbilities = () => {
        const newAbilities = {};
        const abilityNames = ["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma"];
        abilityNames.forEach(name => {
            const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => b - a).pop(); // Remove o menor valor
            newAbilities[name] = rolls.reduce((sum, val) => sum + val, 0);
        });
        setCharacter(prev => ({ ...prev, abilities: newAbilities }));
    };

    const getModifier = (score) => {
        return Math.floor((score - 10) / 2);
    };

    const handleRaceSelect = (race) => {
        setCharacter(prev => ({ ...prev, race }));
    };

    const handleClassSelect = (classData) => {
        setCharacter(prev => ({ ...prev, class: classData }));
    };

    const handleFinish = () => {
        if(!character.name || !character.race || !character.class) {
            alert("Por favor, preencha todos os campos!");
            return;
        }
        onCharacterCreated(character);
    };

    const canProceedToStep = (stepNumber) => {
        switch(stepNumber) {
            case 2:
                return character.race && character.class;
            case 3:
                return Object.keys(character.abilities).length > 0;
            default:
                return true;
        }
    };

    const getProgressWidth = () => {
        return `${(step / 3) * 100}%`;
    };

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
                <div className={`step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}></div>
                <div className={`step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}></div>
                <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
            </div>

            {/* Passo 1: Raça e Classe */}
            {step === 1 && (
                <div className="creator-step slide-in-left">
                    <h2>🏰 Escolha sua Linhagem e Vocação</h2>
                    <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem', color: 'var(--medium-brown)' }}>
                        Defina as bases do seu herói escolhendo sua raça e classe
                    </p>
                    
                    <div className="selection-grid">
                        <div className="form-group">
                            <label className="form-label">🧝‍♀️ Raça</label>
                            <select 
                                value={character.race?.slug || ''} 
                                onChange={e => {
                                    const race = races.find(r => r.slug === e.target.value);
                                    handleRaceSelect(race);
                                }}
                                className="form-control"
                            >
                                <option value="">Selecione uma Raça</option>
                                {races.map(r => (
                                    <option key={r.slug} value={r.slug}>
                                        {translateRace(r.slug)}
                                    </option>
                                ))}
                            </select>
                            {character.race && (
                                <div className="selection-info" style={{
                                    marginTop: '15px',
                                    padding: '15px',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--primary-gold)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4'
                                }}>
                                    <h4 style={{ color: 'var(--dark-red)', marginBottom: '10px' }}>
                                        {translateRace(character.race.slug)}
                                    </h4>
                                    <p>{translateDescription(cleanDescription(character.race.desc?.substring(0, 200) + '...'))}</p>
                                    {character.race.speed && (
                                        <p><strong>Velocidade:</strong> {character.race.speed.walk} metros</p>
                                    )}
                                    {character.race.size_raw && (
                                        <p><strong>Tamanho:</strong> {character.race.size_raw === 'Medium' ? 'Médio' : character.race.size_raw === 'Small' ? 'Pequeno' : character.race.size_raw}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">⚔️ Classe</label>
                            <select 
                                value={character.class?.slug || ''} 
                                onChange={e => {
                                    const classData = classes.find(c => c.slug === e.target.value);
                                    handleClassSelect(classData);
                                }}
                                className="form-control"
                            >
                                <option value="">Selecione uma Classe</option>
                                {classes.map(c => (
                                    <option key={c.slug} value={c.slug}>
                                        {translateClass(c.slug)}
                                    </option>
                                ))}
                            </select>
                            {character.class && (
                                <div className="selection-info" style={{
                                    marginTop: '15px',
                                    padding: '15px',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--primary-gold)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4'
                                }}>
                                    <h4 style={{ color: 'var(--dark-red)', marginBottom: '10px' }}>
                                        {translateClass(character.class.slug)}
                                    </h4>
                                    <p><strong>Dado de Vida:</strong> {character.class.hit_dice}</p>
                                    {character.class.prof_armor && (
                                        <p><strong>Proficiência em Armaduras:</strong> {character.class.prof_armor}</p>
                                    )}
                                    {character.class.prof_weapons && (
                                        <p><strong>Proficiência em Armas:</strong> {character.class.prof_weapons}</p>
                                    )}
                                    {character.class.prof_saving_throws && (
                                        <p><strong>Testes de Resistência:</strong> {character.class.prof_saving_throws}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => { 
                                rollAbilities(); 
                                setStep(2); 
                            }}
                            disabled={!canProceedToStep(2)}
                        >
                            Próximo: Rolar Atributos 🎲
                        </button>
                    </div>
                </div>
            )}

            {/* Passo 2: Habilidades */}
            {step === 2 && (
                <div className="creator-step slide-in-right">
                    <h2>🎲 Atributos do Personagem</h2>
                    <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem', color: 'var(--medium-brown)' }}>
                        Role os dados para determinar seus atributos principais
                    </p>
                    
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <button className="btn btn-secondary" onClick={rollAbilities}>
                            🎲 Rolar Novamente
                        </button>
                    </div>

                    <div className="abilities-grid">
                        {Object.entries(character.abilities).map(([name, score]) => {
                            const modifier = getModifier(score);
                            return (
                                <div key={name} className="ability-card">
                                    <div className="ability-name">{name}</div>
                                    <div className="ability-score">{score}</div>
                                    <div className="ability-modifier">
                                        {modifier >= 0 ? '+' : ''}{modifier}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button className="btn btn-primary" onClick={() => setStep(3)}>
                            Próximo: Nome do Herói 📜
                        </button>
                    </div>
                </div>
            )}

            {/* Passo 3: Nome */}
            {step === 3 && (
                <div className="creator-step slide-in-left">
                    <h2>📜 Batize seu Herói</h2>
                    <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem', color: 'var(--medium-brown)' }}>
                        Escolha um nome épico para seu personagem
                    </p>
                    
                    <div className="form-group">
                        <label className="form-label">⚡ Nome do Personagem</label>
                        <input 
                            type="text" 
                            placeholder="Digite o nome do seu herói..." 
                            value={character.name}
                            onChange={e => setCharacter(prev => ({...prev, name: e.target.value}))}
                            style={{ textAlign: 'center', fontSize: '1.2rem' }}
                        />
                    </div>

                    {/* Resumo do personagem */}
                    <div className="character-summary" style={{ 
                        background: 'rgba(212, 175, 55, 0.1)', 
                        border: '2px solid var(--primary-gold)', 
                        borderRadius: '12px', 
                        padding: '25px', 
                        margin: '25px 0',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: 'var(--dark-red)', marginBottom: '20px' }}>
                            Resumo do Personagem
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            <div>
                                <strong>Nome:</strong> {character.name || 'Não definido'}
                            </div>
                            <div>
                                <strong>Raça:</strong> {character.race?.name || 'Não selecionada'}
                            </div>
                            <div>
                                <strong>Classe:</strong> {character.class?.name || 'Não selecionada'}
                            </div>
                            <div>
                                <strong>Nível:</strong> {character.level}
                            </div>
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