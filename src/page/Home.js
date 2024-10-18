import React, { useState, useEffect } from 'react';

export default function Home() {
  const [pokemonList, setPokemonList] = useState([]); // To store the list of Pokémon
  const [loading, setLoading] = useState(true); // To manage loading state
  const [currentPage, setCurrentPage] = useState(0); // To manage the current page
  const itemsPerPage = 20; // Number of items per page

  useEffect(() => {
    // Fetch the first 151 Pokémon
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json(); // Fetch the details of each Pokémon
          })
        );
        setPokemonList(pokemonDetails); // Store the details of all 151 Pokémon
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        setLoading(false); // Stop loading even on error
      }
    };

    fetchPokemonList();
  }, []);

  if (loading) {
    return <div style={{ fontSize: '24px', textAlign: 'center', marginTop: '50px' }}>Loading...</div>; // Show loading while fetching
  }

  // Calculate the current Pokémon to display
  const startIndex = currentPage * itemsPerPage;
  const currentPokemons = pokemonList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="pokemon-container">
      <h1 className="pokemon-header">Fetching the Original Pokémon Using the PokeAPI</h1>
      <div className="pokemon-grid">
        {currentPokemons.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pokemon-image" />
            <h3 className="pokemon-name">{pokemon.name}</h3>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>Page {currentPage + 1}</span>
        <button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(pokemonList.length / itemsPerPage) - 1))}
          disabled={currentPage >= Math.ceil(pokemonList.length / itemsPerPage) - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
