import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Container/Main/Main";
import Pokeinfo from "./Container/Pokeinfo/Pokeinfo";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/pokemon/:id" element={<Pokeinfo data={undefined}/>} />
      </Routes>
    </Router>
  );
};

export default App;
