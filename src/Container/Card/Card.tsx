// Card.tsx
import React from "react";

interface CardProps {
  pokemon: Array<any>;
  loading: boolean;
  infoPokemon: (poke: any) => void;
}

const Card: React.FC<CardProps> = ({ pokemon, loading, infoPokemon }) => {
  return (
    <div className="border border-gray-300 rounded p-4 shadow-md mb-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        pokemon.map((poke) => (
          <div key={poke.id} onClick={() => infoPokemon(poke)} className="cursor-pointer">
            <img
              className="mx-auto"
              src={poke.sprites.front_default}
              alt={poke.name}
              style={{ width: "96px", height: "96px" }}
            />
            <p className="text-center text-lg font-semibold mt-2">{poke.name}</p>
            <p className="text-center text-gray-500">ID: {poke.id}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Card;
