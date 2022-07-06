import React, { Suspense, lazy } from "react";
import Loader from "./components/loader";
import './App.css';


import Header from './components/header'; 
import Main from './components/main'; 

const App = () => {
  return (
    <>
      <Suspense fallback={<Loader message="Loading..." />}>
        <Header />
        <Main />
      </Suspense>

    </>
  );
};

export default App;
