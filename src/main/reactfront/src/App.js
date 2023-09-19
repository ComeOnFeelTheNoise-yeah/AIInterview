import './App.css';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SignUp from "./views/Authentication/SignUp";
import Authentication from "./views/Authentication";
import MainLayout from "./views/layouts/MainLayout";

const App = () => {

  return (
    <MainLayout/>
  )
} 

export default App;
