import './landing.css'
import { icons } from '../../assets/icons'

export const Landing = () => {


    return (
        <main className='landing'>
            <div className='landing-container'>
                <h1>Song Sorting Hat</h1>
                <form className='search-form'>
                    <input type='text' className='search-bar'>
                    </input>
                    <img className='search-icon' src={icons.search}/>
                </form>
            </div>
        </main>
    )
}