import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Card from "../Card/Card";
import { Button, Input } from "../../Components";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Pokemon {
  id: number;
}

interface MainProps {}

const Main: React.FC<MainProps> = () => {
  const [pokeData, setPokeData] = useState<Array<Pokemon>>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [pokeDex, setPokeDex] = useState<Pokemon | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [startId, setStartId] = useState<number | null>(null);
  const [endId, setEndId] = useState<number | null>(null);
  const navigate = useNavigate();

  const pokeFun = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}?limit=20&offset=0`);
      setNextUrl(res.data.next);
      setPrevUrl(res.data.previous);
      getPokemon(res.data.results);
    } catch (error: any) {
      console.error("Error fetching Pokémon list:", (error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  };

  const getPokemon = async (res: Array<any>) => {
    setLoading(true);
    setPokeData([]);

    const fetchData = async (item: any) => {
      try {
        const result = await axios.get(item.url);
        setPokeData((state) => [...state, result.data]);
      } catch (error: any) {
        console.error(
          "Error fetching Pokémon details:",
          (error as AxiosError).message
        );
      }
    };

    try {
      await Promise.all(res.map(fetchData));
      setPokeData((state) => state.sort((a, b) => (a.id > b.id ? 1 : -1)));
    } catch (error: any) {
      console.error("Error fetching Pokémon:", (error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: { searchTerm: string }) => {
    setLoading(true);
    setPokeData([]);
    setSearchError(null);

    try {
      const apiUrl = `https://pokeapi.co/api/v2/pokemon/${values.searchTerm.toLowerCase()}`;
      const res = await axios.get(apiUrl);
      setPokeData([res.data]);
    } catch (error: any) {
      console.error("Error fetching Pokémon:", (error as AxiosError).message);
      setSearchError("Pokemon not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFindID = async () => {
    if (startId !== null && endId !== null) {
      setLoading(true);
      setPokeData([]);
      setSearchError(null);

      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${endId - startId + 1}&offset=${startId - 1}`
        );
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);
        getPokemon(response.data.results);
      } catch (error: any) {
        console.error("Error fetching Pokémon:", (error as AxiosError).message);
        setSearchError("Error fetching Pokémon. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInfoPokemon = (poke: Pokemon) => {
    setPokeDex(poke);
    console.log("Selected Pokemon Data:", poke);

    navigate(`/pokemon/${poke.id}`);
  };

  useEffect(() => {
    pokeFun();
  }, [url]);

  // Formik validation schema
  const validationSchema = Yup.object({
    searchTerm: Yup.string().required("Pokemon Name or ID is required"),
  });

  // Formik form
  const formik = useFormik({
    initialValues: {
      searchTerm: "",
    },
    validationSchema,
    onSubmit: (values) => handleSearch(values),
  });

  return (
    <div className="min-h-screen flex flex-col items-center">
      <nav className="bg-blue-500 p-4 w-full">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-white text-lg font-bold">Pokémon</h1>
          <div className="flex items-center">
            <form onSubmit={formik.handleSubmit} className="flex items-center">
              <Input
                className={`w-full border-neutral-400 border p-2`}
                type="text"
                placeholder="Pokémon Name or ID"
                id="searchTerm"
                name="searchTerm"
                value={formik.values.searchTerm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Button
                type="submit"
                className="bg-red-800 text-white px-4 py-2 rounded font-semibold ml-2"
                label="Search"
              />
            </form>
          </div>
          <div className="flex items-center">
            <Input
              className="w-16 border-neutral-400 border p-2"
              type="number"
              placeholder="Start ID"
              value={startId !== null ? startId : ""}
              onChange={(e) => setStartId(parseInt(e.target.value, 10))}
            />
            <Input
              className="w-16 border-neutral-400 border p-2 ml-2"
              type="number"
              placeholder="End ID"
              value={endId !== null ? endId : ""}
              onChange={(e) => setEndId(parseInt(e.target.value, 10))}
            />
            <Button
              onClick={handleFindID}
              className="bg-red-800 text-white px-4 py-2 rounded font-semibold ml-2"
              label="Find ID"
            />
          </div>
        </div>
      </nav>
      <div className="container p-4 flex-1">
        <div className="left-content text-center mb-8">
          {formik.touched.searchTerm && formik.errors.searchTerm && (
            <p className="text-red-500 mb-2">{formik.errors.searchTerm}</p>
          )}

          <div className="grid grid-cols-5 gap-4 mt-4">
            {pokeData.map((pokemon) => (
              <Card
                key={pokemon.id}
                pokemon={[pokemon]}
                loading={loading}
                infoPokemon={handleInfoPokemon}
              />
            ))}
          </div>

          <div className="btn-group mt-4">
            {prevUrl && (
              <Button
                onClick={() => {
                  setPokeData([]);
                  setUrl(prevUrl);
                }}
                className="bg-red-800 text-white px-4 py-2 rounded font-semibold ml-2"
                label="Previous"
              />
            )}
            {nextUrl && (
              <Button
                onClick={() => {
                  setPokeData([]);
                  setUrl(nextUrl);
                }}
                className="bg-red-800 text-white px-4 py-2 rounded font-semibold ml-2"
                label="Next"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
