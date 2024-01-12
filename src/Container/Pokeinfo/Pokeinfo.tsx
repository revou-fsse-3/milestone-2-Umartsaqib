import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

interface PokeinfoProps {
  data: any;
}

const Pokeinfo: React.FC<PokeinfoProps> = ({ data }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemonDetails, setPokemonDetails] = useState<any | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemonDetails(response.data);
      } catch (error: any) {
        console.error("Error fetching Pokémon details:", (error as AxiosError).message);
      }
    };

    if (id) {
      fetchPokemonDetails();
    }
  }, [id]);

  console.log("Pokeinfo Data:", data);

  return (
    <div className="container mx-auto mt-8 p-4 bg-white border rounded-lg shadow-lg">
      {pokemonDetails ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{pokemonDetails.name}</h1>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonDetails.id}.svg`}
            alt={pokemonDetails.name}
            className="mx-auto mb-4"
          />
          <div className="abilities">
            <h2 className="text-xl font-semibold mb-2">Abilities:</h2>
            <div className="flex flex-wrap gap-2">
              {pokemonDetails.abilities.map((poke: any, index: number) => (
                <button
                  key={poke.ability.name}
                  className={`px-4 py-2 rounded focus:outline-none ${
                    index % 2 === 0 ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'
                  } hover:bg-opacity-75`}
                >
                  {poke.ability.name}
                </button>
              ))}
            </div>
          </div>
          <div className="base-stat mt-4">
            <h2 className="text-xl font-semibold mb-2">Base Stats:</h2>
            <ul>
              {pokemonDetails.stats.map((poke: any) => (
                <li key={poke.stat.name} className="text-gray-700">
                  <strong>{poke.stat.name}:</strong> {poke.base_stat}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Back
          </button>
        </>
      ) : null}
    </div>
  );
};

export default Pokeinfo;
