import './landing.css'
import { SubNavbar } from '../../Components/SubNavbar/subnavbar'

export const Landing = () => {

    const onSubmit = (data) => {

    }

    return (
        <main className='landing'>
            <h1>Song Sorting Hat</h1>
            <SubNavbar />
            <form className='search-form'>
                <input type='text' className='search-bar'>
                
                </input>
            </form>
        </main>
    )
}