import React, { Suspense } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Loader from "./components/loader";
import './App.css';

import "bootstrap-icons/font/bootstrap-icons.css";
// import Header from './components/header'; 
// import Main from './components/main'; 
import { useState } from "react";
import { useEffect } from "react";

const Header = React.lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./components/header")), 300);
  });
});

const Main = React.lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import("./components/main")), 300);
  });
});
const App = () => {

  
  return (
    <Router>
      <Suspense fallback={<Loader message="Loading..." />}>
        <Header />
        <Main />
      </Suspense>
    </Router>
  );
};

export default App;
