import { Landing } from './Routes/Landing/landing.jsx'
import { Ranking } from './Routes/RankingPage/ranking.jsx'
import { Catalogue } from './Routes/Catalogue/catalogue.jsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Link, Outlet } from 'react-router-dom'


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
                    <Link to='/' className='nav-item-tag'>Home</Link>
                </li>
                <li className='nav-item'>
                    <Link to='/catalogue' className='nav-item-tag'>Catalogue</Link>
                </li>
            </ul>
            <div>
                <Outlet />
            </div>
        </>
    )
}
