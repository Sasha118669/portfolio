import React from "react";
import { useState } from 'react'
import './App.css'
import HomePage from './HomePage.jsx'
import PortalGame from './PortalGame.jsx'
// import StartBtn from './StartBtn.jsx'

import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
     <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portalgame" element={<PortalGame />} />
    </Routes>
    </>
  )
}
