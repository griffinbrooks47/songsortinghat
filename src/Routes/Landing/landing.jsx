import './landing.css'
import { Navbar } from '../../Components/Navbar/navbar'
import { SubNavbar } from '../../Components/SubNavbar/subnavbar'

export const Landing = () => {

    const onSubmit = (data) => {

    }

    return (
        <main className='landing'>
            <div className='landing-container'>
                <h1>Song Sorting Hat</h1>
                <SubNavbar />
                <form className='search-form'>
                    <input type='text' className='search-bar'>
                    
                    </input>
                </form>
            </div>
        </main>
    )
}