import './landing.css'
import { icons } from '../../assets/icons'
import { useArtistContext } from '../../Context/artist-context'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from "react-router-dom"

export const Landing = () => {

    // artist data
    const { artist, setArtist, artistLoaded, setArtistLoaded, picture, setPicture, id, setId, artistData, setArtistData } = useArtistContext();

    // API request
    const api_url = 'http://localhost:5000/search?artist='
    const fetchData = async (url) => {
        fetch(url)
        .then((response) => response.json())
        .then(data => {
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
                <h1 className='landing-title'>Song Sorting Hat</h1>
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