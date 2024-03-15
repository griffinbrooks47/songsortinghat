import './landing.css'
import { icons } from '../../assets/icons'
import { useArtistContext } from '../../Context/artist-context'
import { useForm } from 'react-hook-form'
import { yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from "react-router-dom"
import { Catalogue } from '../Catalogue/catalogue'
import { useEffect, useState } from 'react'
import { LazyLoadImage } from "react-lazy-load-image-component"
import { zoomies, waveform, lineWobble } from 'ldrs'

export const Landing = () => {

    // Global artist data.
    const { artist, setArtist, artistLoaded, setArtistLoaded, picture, setPicture, id, setId, artistData, setArtistData, catalogue, addToCatalogue, clearArtistData } = useArtistContext();

    // API request url.
    const api_url = 'https://gbrooks.pythonanywhere.com/search?artist='

    // Signals that a request has been made to the backend. 
    const [requested, setRequested] = useState(false);

    waveform.register();
    zoomies.register();
    lineWobble.register(); //obble.register(); //obble.register();

    const deluxe_keywords = ["deluxe", "expanded", "bonus", "anniversary", "remastered", "extended", "complete", "collectors edition"];

    useEffect(() => {
        clearArtistData();
        setRequested(false);
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
            setArtistLoaded(true);
            setRequested(false);

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
        setRequested(true);
        let search_query = api_url + data.artist
        fetchData(search_query)
    }

    return (
        <main className='landing'>
            <div className='landing-container'>
                {!artistLoaded && 
                    <img className='logo' src={icons.logo_ssh} />
                }
                {artistLoaded && 
                <ArtistProfile name={artist} picture={picture} drawing={icons.goated_taste}/>
                }
                {!artistLoaded && !requested &&
                    <>
                        <form className='search-form' onSubmit={handleSubmit(onSubmit)}>
                            <input type='text' className='search-bar' placeholder={"Bruno Mars"} {...register("artist")}/>
                            <img className='search-icon' src={icons.search}/>
                            <img src={icons.type_artist} className='search-drawing'></img>
                        </form>
                        <h3>current demo, website under construction</h3>
                    </>
                }
                {requested && !artistLoaded &&
                    <>                      
                        <l-line-wobble
                        size="100"
                        stroke="5"
                        bg-opacity="0.1"
                        speed="2.8" 
                        color="black" 
                        ></l-line-wobble>
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
                <span className='artist-profile-label'>Your Artist:</span>
                <h1 className='artist-profile-title'>{props.name}</h1>
                <Link className="artist-profile-button" to={'/catalogue'}>Start Ranking</Link>
            </div>
            <LazyLoadImage 
                className='artist-profile-picture'
                alt='image'
                src={props.picture}
                effect='blur'
                placeholderSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/w+GHwAItwJ3OrKbAAAAABJRU5ErkJggg=="
            />
        </div>
    )
}