import React from "react";
import {Route, Routes} from "react-router-dom";
import ProjectMain from "./views/ProjectMain";
import ChatBot from "./views/ChatBot";
import Interview from "./views/Interview";
import Analysis from "./views/Analysis";
import Board from "./views/Board";

export default function Routing(){
    return (
        <div>
            <div style={{ marginTop: '83px' }}>
                <Routes>
                    <Route path='/' element={<ProjectMain/>} />
                    <Route path='/chatbot' element={<ChatBot/>} />
                    <Route path='/interview' element={<Interview />} />
                    <Route path='/analysis' element={<Analysis/>} />
                    <Route path='/board' element={<Board/>} />
                </Routes>
            </div>
        </div>
    )
}