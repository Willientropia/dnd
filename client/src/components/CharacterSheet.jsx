import React from 'react';

function CharacterSheet({ character, onNewCharacter }) {
    const getModifier = (score) => Math.floor((score - 10) / 2);

    // Calcula o HP
    const constModifier = getModifier(character.abilities.Constituição);
    const hitDie = parseInt(character.class.hit_dice.split('d')[1]);
    const hp = hitDie + constModifier;

    return (
        <div id="character-sheet">
            <h2>{character.name}</h2>
            <div className="sheet-grid">
                <div className="sheet-section">
                    <h3>Atributos</h3>
                    <p><strong>Raça:</strong> {character.race.name}</p>
                    <p><strong>Classe:</strong> {character.class.name}</p>
                    <p><strong>HP:</strong> {hp} / {hp}</p>
                </div>
                <div className="sheet-section">
                    <h3>Habilidades</h3>
                    <ul>
                        {Object.entries(character.abilities).map(([name, score]) => (
                            <li key={name}><strong>{name}:</strong> {score} ({getModifier(score) > 0 ? '+' : ''}{getModifier(score)})</li>
                        ))}
                    </ul>
                </div>
            </div>
            <button onClick={onNewCharacter}>Criar Novo Personagem</button>
        </div>
    );
}

export default CharacterSheet;