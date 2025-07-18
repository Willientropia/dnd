import React, { useState, useEffect } from 'react';
import { fetchData } from '../api';

function CharacterCreator({ onCharacterCreated }) {
    const [step, setStep] = useState(1);
    const [races, setRaces] = useState([]);
    const [classes, setClasses] = useState([]);
    const [character, setCharacter] = useState({
        name: '',
        race: null,
        class: null,
        abilities: {}
    });

    useEffect(() => {
        fetchData('races').then(setRaces);
        fetchData('classes').then(setClasses);
    }, []);
    
    const rollAbilities = () => {
        const newAbilities = {};
        const abilityNames = ["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma"];
        abilityNames.forEach(name => {
            const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => a - b).shift();
            newAbilities[name] = rolls.reduce((sum, val) => sum + val, 0);
        });
        setCharacter(prev => ({ ...prev, abilities: newAbilities }));
    };

    const handleFinish = () => {
        if(!character.name || !character.race || !character.class) {
            alert("Por favor, preencha todos os campos!");
            return;
        }
        onCharacterCreated(character);
    }
    
    return (
        <div id="character-creator">
            {/* Passo 1 */}
            {step === 1 && (
                <div className="creator-step">
                    <h2>Passo 1: Raça e Classe</h2>
                    <select onChange={e => setCharacter({...character, race: races.find(r => r.slug === e.target.value)})}>
                        <option>Selecione a Raça</option>
                        {races.map(r => <option key={r.slug} value={r.slug}>{r.name}</option>)}
                    </select>
                    <select onChange={e => setCharacter({...character, class: classes.find(c => c.slug === e.target.value)})}>
                        <option>Selecione a Classe</option>
                        {classes.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                    <button onClick={() => { rollAbilities(); setStep(2); }}>Próximo</button>
                </div>
            )}
            {/* Passo 2 */}
            {step === 2 && (
                 <div className="creator-step">
                    <h2>Passo 2: Habilidades</h2>
                    <button onClick={rollAbilities}>Rolar Novamente</button>
                    {Object.entries(character.abilities).map(([name, score]) => <p key={name}>{name}: {score}</p>)}
                    <button onClick={() => setStep(3)}>Próximo</button>
                </div>
            )}
            {/* Passo 3 */}
            {step === 3 && (
                 <div className="creator-step">
                     <h2>Passo 3: Nome</h2>
                    <input type="text" placeholder="Nome do Personagem" onChange={e => setCharacter({...character, name: e.target.value})} />
                    <button onClick={handleFinish}>Finalizar</button>
                </div>
            )}
        </div>
    );
}

export default CharacterCreator;