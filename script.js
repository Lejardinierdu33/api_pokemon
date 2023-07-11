const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
const pokemonGrid = document.getElementById('pokemon-grid');
const generationSelect = document.getElementById('generation-select');
const teamList = document.getElementById('team-list');
const teamSizeLimit = 6;
let teamCount = 0;
let selectedGeneration = 0; // 0 pour toutes les générations

// Charger et afficher les Pokémon
async function loadPokemons() {
  try {
    pokemonGrid.innerHTML = '';

    const response = await fetch(`${apiUrl}?limit=151`);
    const data = await response.json();
    const pokemons = data.results;

    for (let i = 0; i < pokemons.length; i++) {
      const pokemon = pokemons[i];

      if (selectedGeneration === 0 || selectedGeneration === Math.ceil((i + 1) / 151)) {
        const pokemonData = await getPokemonData(pokemon.name);
        createPokemonCard(pokemonData);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// Récupérer les données d'un Pokémon individuel
async function getPokemonData(name) {
  try {
    const response = await fetch(`${apiUrl}/${name}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Créer une carte pour afficher les informations d'un Pokémon
function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');

  const image = document.createElement('img');
  image.src = pokemon.sprites.front_default;
  image.alt = pokemon.name;

  const name = document.createElement('h3');
  name.textContent = pokemon.name;

  const stats = document.createElement('ul');
  stats.classList.add('pokemon-stats');
  for (const stat of pokemon.stats) {
    const statItem = document.createElement('li');
    statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
    stats.appendChild(statItem);
  }

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(stats);

  // Événement de clic pour ajouter ou retirer le Pokémon de l'équipe
  card.addEventListener('click', () => {
    if (card.classList.contains('selected')) {
      card.classList.remove('selected');
      removeFromTeam(pokemon);
    } else {
      if (teamCount < teamSizeLimit) {
        card.classList.add('selected');
        addToTeam(pokemon);
      }
    }
  });

  pokemonGrid.appendChild(card);
}

// Ajouter un Pokémon à l'équipe
function addToTeam(pokemon) {
  const listItem = document.createElement('li');
  listItem.classList.add('team-pokemon');

  const image = document.createElement('img');
  image.src = pokemon.sprites.front_default;
  image.alt = pokemon.name;

  const name = document.createElement('span');
  name.textContent = pokemon.name;

  listItem.appendChild(image);
  listItem.appendChild(name);

  teamList.appendChild(listItem);
  teamCount++;
}

// Retirer un Pokémon de l'équipe
function removeFromTeam(pokemon) {
  const listItem = teamList.querySelector(`.team-pokemon img[src="${pokemon.sprites.front_default}"]`).parentNode;
  listItem.remove();
  teamCount--;
}

// Mettre à jour la génération sélectionnée
generationSelect.addEventListener('change', () => {
  selectedGeneration = parseInt(generationSelect.value);
  loadPokemons();
});

// Charger les Pokémon lors du chargement de la page
window.addEventListener('load', () => {
  loadPokemons();
});
