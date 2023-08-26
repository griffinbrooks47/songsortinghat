import { useState } from 'react'
import { Navbar } from './Components/Navbar/navbar.jsx'
import { Landing } from './Routes/Landing/landing.jsx'
import { Ranking } from './Routes/Landing/RankingPage/ranking.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, Routes, Link, RouterProvider, Outlet } from 'react-router-dom'
import './App.css'

function App() {

    return (
        <Landing />
    )
}

export default App
