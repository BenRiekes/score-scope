import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./Components/Navbar";

//Pages:
import Parlay from "./Pages/Parlay";
import Stats from "./Pages/Stats";
import Versus from "./Pages/Versus";
import Profile from "./Pages/Profile"; 
import ViewProfile from "./Pages/ViewProfile";
import Leaderboards from "./Pages/Leaderboards";  

function App() {

  return (

    <>
      <Navbar />

      <div>
        
        <Routes>

          <Route path = "/" element = {<Parlay />} />
          <Route path = "/versus" element = {<Versus />} />

          <Route path = "/stats" element = {<Stats />} />
          <Route path = "/leaderboards" element = {<Leaderboards />} />

          <Route path = "/profile" element = {<Profile />} />
          <Route path = "/viewProfile/:user" element = {<ViewProfile />} />
        </Routes>

      </div>
    </>
  );

}

export default App;
