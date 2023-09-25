import './App.css';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SignUp from "./views/Authentication/SignUp";
import Authentication from "./views/Authentication";
import MainLayout from "./views/layouts/MainLayout";
import ChatWindow from "./components/ChatWindow";
import ProjectMain from "./views/ProjectMain";

const App = () => {

  return (
    <ProjectMain/>
  )
} 

export default App;
