import './navbar.css'
import { Link, Outlet } from 'react-router-dom'

export const Navbar = () => {
    return (
        <nav className='navbar'>
            <Link to='/' className='nav-item'>Home</Link>
            <Link className='nav-item'>Sorting</Link>
        </nav>
    )
}