import { Landing } from './Routes/Landing/landing.jsx'
import { Ranking } from './Routes/RankingPage/ranking.jsx'
import { Catalogue } from './Routes/Catalogue/catalogue.jsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Link, Outlet } from 'react-router-dom'
import { useState, useContext } from 'react'
import axios from 'axios'
import './App.css'
  

function App() {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path='/' element={<Root />}>
                <Route index element={<Landing />}/>
                <Route path='ranking' element={<Ranking  />}/>
                <Route path='catalogue' element={<Catalogue />}/>
            </Route>
        )
    )

    axios.get('http://musicbrainz.org/ws/2/artist/?query=chancetherapper&fmt=json')
      .then(res => {
        console.log(res.data);
      })

    const [songData, setSongData] = useState({});


    return (
        <div className='App'>
            <RouterProvider router={router}/>
        </div>
    )
}

export default App

const Root = () => {
    
    return (
        <>
            <ul className='navbar'>
                <li className='nav-item'>
                    <Link to='/'>Home</Link>
                </li>
                <li className='nav-item'>
                    <Link to='/ranking'>About</Link>
                </li>
                <li className='nav-item'>
                    <Link to='/ranking'>Contact</Link>
                </li>
            </ul>
            <div>
                <Outlet />
            </div>
        </>
    )
}
