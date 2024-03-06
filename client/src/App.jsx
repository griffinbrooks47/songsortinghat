import { Landing } from './Routes/Landing/landing.jsx'
import { Ranking} from './Routes/RankingPage/ranking.jsx'
import { Catalogue } from './Routes/Catalogue/catalogue.jsx'
import { Customize } from './Routes/Customize/customize.jsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Link, Outlet } from 'react-router-dom'
import ArtistContextProvider from './Context/artist-context.jsx'
import { icons } from './assets/icons.jsx'

import './App.css'

function App() {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path='/' element={<Root />}>
                <Route index element={<Landing />}/>
                <Route path='catalogue' element={<Catalogue />}/>
                <Route path='customize' element={<Customize />}/>
                <Route path='ranking' element={<Ranking />}/>
            </Route>
        )
    )

    return (
        <ArtistContextProvider>
            <div className='App'>
                <RouterProvider router={router} history={history}/>
            </div>
        </ArtistContextProvider>
        
    )
}

export default App

const Root = () => {
    
    return (
        <>
            <ul className='navbar'>
                <li className='nav-item'>
                    <Link to='/' className='nav-item-tag'></Link>
                    <img className='nav-item-home-img' src={icons.logo_ssh}></img>
                </li>
                <li className='nav-item'>
                    <Link to='/ranking' className='nav-item-tag'>Current Page</Link>
                </li>
            </ul>
            <div>
                <Outlet />
            </div>
        </>
    )
}
