// Traduções para raças, classes e outros elementos do D&D
export const translations = {
  races: {
    'human': 'Humano',
    'elf': 'Elfo',
    'dwarf': 'Anão',
    'halfling': 'Halfling',
    'half-elf': 'Meio-Elfo',
    'half-orc': 'Meio-Orc',
    'gnome': 'Gnomo',
    'tiefling': 'Tiefling',
    'dragonborn': 'Draconato',
    'drow': 'Drow',
    'high-elf': 'Alto Elfo',
    'hill-dwarf': 'Anão da Colina',
    'lightfoot': 'Pés Ligeiros',
    'rock-gnome': 'Gnomo da Rocha',
    'alseid': 'Alseid',
    'catfolk': 'Povo Gato',
    'darakhul': 'Darakhul',
    'derro': 'Derro',
    'erina': 'Erina',
    'gearforged': 'Forjado em Engrenagens',
    'minotaur': 'Minotauro',
    'mushroomfolk': 'Povo Cogumelo',
    'satarre': 'Satarre',
    'shade': 'Sombra'
  },
  
  classes: {
    'barbarian': 'Bárbaro',
    'bard': 'Bardo',
    'cleric': 'Clérigo',
    'druid': 'Druida',
    'fighter': 'Guerreiro',
    'monk': 'Monge',
    'paladin': 'Paladino',
    'ranger': 'Ranger',
    'rogue': 'Ladino',
    'sorcerer': 'Feiticeiro',
    'warlock': 'Bruxo',
    'wizard': 'Mago'
  },
  
  abilities: {
    'Strength': 'Força',
    'Dexterity': 'Destreza', 
    'Constitution': 'Constituição',
    'Intelligence': 'Inteligência',
    'Wisdom': 'Sabedoria',
    'Charisma': 'Carisma'
  },
  
  terms: {
    'Hit Points': 'Pontos de Vida',
    'Armor Class': 'Classe de Armadura',
    'Speed': 'Velocidade',
    'Darkvision': 'Visão no Escuro',
    'Languages': 'Idiomas',
    'Proficiencies': 'Proficiências',
    'Traits': 'Traços',
    'Features': 'Características',
    'Equipment': 'Equipamentos',
    'Weapons': 'Armas',
    'Armor': 'Armaduras',
    'Tools': 'Ferramentas',
    'Saving Throws': 'Testes de Resistência',
    'Skills': 'Perícias',
    'feet': 'metros'
  },
  
  equipment: {
    'Leather Armor': 'Armadura de Couro',
    'Chain Mail': 'Cota de Malha',
    'Shield': 'Escudo',
    'Sword': 'Espada',
    'Bow': 'Arco',
    'Dagger': 'Adaga',
    'Staff': 'Cajado',
    'Backpack': 'Mochila',
    'Rope': 'Corda',
    'Rations': 'Rações',
    'Bedroll': 'Saco de Dormir',
    'Thieves Tools': 'Ferramentas de Ladrão',
    'Holy Symbol': 'Símbolo Sagrado',
    'Spellbook': 'Livro de Magias'
  }
};

// Função para traduzir texto
export function translate(key, category = 'terms') {
  if (!translations[category]) return key;
  return translations[category][key] || key;
}

// Função para traduzir nome de raça
export function translateRace(raceSlug) {
  return translations.races[raceSlug] || raceSlug;
}

// Função para traduzir nome de classe
export function translateClass(classSlug) {
  return translations.classes[classSlug] || classSlug;
}

// Função para traduzir habilidades
export function translateAbility(abilityName) {
  return translations.abilities[abilityName] || abilityName;
}

// Função para limpar e formatar descrições HTML
export function cleanDescription(htmlString) {
  if (!htmlString) return '';
  
  // Remove tags HTML mas mantém quebras de linha
  return htmlString
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Função para traduzir termos comuns em descrições
export function translateDescription(description) {
  if (!description) return '';
  
  let translated = description;
  
  // Traduz termos comuns
  Object.entries(translations.terms).forEach(([english, portuguese]) => {
    const regex = new RegExp(english, 'gi');
    translated = translated.replace(regex, portuguese);
  });
  
  return translated;
}
