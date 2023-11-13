import './landing.css'
import { icons } from '../../assets/icons'
import { useArtistContext } from '../../Context/artist-context'
import { useForm } from 'react-hook-form'
import { yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from "react-router-dom"
import { Catalogue } from '../Catalogue/catalogue'

export const Landing = () => {

    // artist data
    const { artist, setArtist, artistLoaded, setArtistLoaded, picture, setPicture, id, setId, artistData, setArtistData, catalogue, addToCatalogue } = useArtistContext();

    // API request
    const api_url = 'http://localhost:5000/search?artist='

    const deluxe_keywords = ["deluxe", "expanded", "bonus", "anniversary", "remastered", "extended", "complete", "collectors edition"];

    // not fully implemented yet
    const checkDupe = (title, albums) => {
        title = title.toLowerCase();
        for(let album of albums){
            let albumCopy = album.toLowerCase();
            if(albumCopy.includes(title) && albumCopy != title){
                let cutOff = albumCopy.replace(title, '').indexOf(' ');
                console.log(cutOff, albumCopy)
                if(albumCopy.includes(title) && cutOff == 0){
                    for(const keyword of deluxe_keywords){
                        if(albumCopy.includes(keyword)){
                            return false
                        }
                    }
                }
            }
        }
        return true;
    }

    const fetchData = async (url) => {
        fetch(url)
        .then((response) => response.json())
        .then(data => {
            console.log(data);
            const catalogueAlbums = {}
            const catalogueSingles = {}
            data.albums.forEach((album, index) => {
                album['isIncluded'] = true;
                album['id'] = index;
                album['category'] = 'album'

                catalogueAlbums[index] = album;
            })
            data.singles.forEach((single, index) => {
                single['isIncluded'] = true;
                single['id'] = index;
                single['category'] = 'single'

                catalogueSingles[index] = single;
            })
            setArtistData(data)
            setArtist(data.artist[0].name)
            setPicture(data.artist[0].images[0].url)
            setArtistLoaded(true)
        })
        .catch(err => {
            console.log(err)
        })
    }
    
    // form validation
    const schema = yup.object().shape({
        artist: yup.string().required()
    })
    const { register, handleSubmit} = useForm({
        resolver: yupResolver(schema),
    });

    // react router
    let navigate = useNavigate();

    const onSubmit = (data) => {
        let search_query = api_url + data.artist
        fetchData(search_query)
    }

    return (
        <main className='landing'>
            <div className='landing-container'>
                <h1 className='landing-title'>Search</h1>
                {artistLoaded && 
                <ArtistProfile name={artist} picture={picture}/>
                }
                <form className='search-form' onSubmit={handleSubmit(onSubmit)}>
                    <input type='text' className='search-bar' {...register("artist")}/>
                    <img className='search-icon' src={icons.search}/>
                </form>
            </div>
        </main>
    )
}

export const ArtistProfile = (props) => {
    return (
        <div className='artist-profile'>
            <div className='artist-profile-info'>
                <h1 className='artist-profile-title'>{props.name}</h1>
                <Link to={'/catalogue'}>Start Ranking</Link>
            </div>
            <img className='artist-profile-picture' src={props.picture}/>
        </div>
    )
}