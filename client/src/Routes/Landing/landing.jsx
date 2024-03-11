import './landing.css'
import { icons } from '../../assets/icons'
import { useArtistContext } from '../../Context/artist-context'
import { useForm } from 'react-hook-form'
import { yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from "react-router-dom"
import { Catalogue } from '../Catalogue/catalogue'
import { useEffect } from 'react'

export const Landing = () => {

    // artist data
    const { artist, setArtist, artistLoaded, setArtistLoaded, picture, setPicture, id, setId, artistData, setArtistData, catalogue, addToCatalogue, clearArtistData } = useArtistContext();

    // API request
    const api_url = 'https://gbrooks.pythonanywhere.com/search?artist='

    const deluxe_keywords = ["deluxe", "expanded", "bonus", "anniversary", "remastered", "extended", "complete", "collectors edition"];

    useEffect(() => {
        clearArtistData();
    }, [])

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

            console.log(data);
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
                {!artistLoaded && 
                    <img className='logo' src={icons.logo_ssh}>
                        
                    </img>
                }
                {artistLoaded && 
                <ArtistProfile name={artist} picture={picture} drawing={icons.goated_taste}/>
                }
                {!artistLoaded &&
                    <>
                        <form className='search-form' onSubmit={handleSubmit(onSubmit)}>
                            <input type='text' className='search-bar' placeholder={"Bruno Mars"} {...register("artist")}/>
                            <img className='search-icon' src={icons.search}/>
                            <img src={icons.type_artist} className='search-drawing'></img>
                        </form>
                        <h2>current demo, website under construction</h2>
                    </>
                }
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
            <img className="artist-profile-drawing" src={props.drawing}></img>
        </div>
    )
}