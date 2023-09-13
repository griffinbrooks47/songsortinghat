import { useState, useEffect } from 'react';
import './catalogue.css'
import { useArtistContext } from '../../Context/artist-context';

export const Catalogue = () => {

    const { artist, setArtist, artistData, setArtistData } = useArtistContext();

    if (artistData == {}){
        return (
            <div>
                Nothing
            </div>
        )
    }

    return (
        <>
            <div className='catalogue-settings'>
                <h2 className='settings-header'>List Options</h2>
                <ul className='settings-buttons'>

                </ul>
            </div>
            <div className='catalogue'>
                <h2 className='catalogue-header'>Projects</h2>
                <ul className='catalogue-albums'>
                {
                    artistData.albums.map((album, index) => (
                        <AlbumCard name={album.name} cover={album.cover} key={index} />
                    ))
                }
                </ul>
                <h2 className='catalogue-header'>Singles</h2>
                <ul className='catalogue-singles'>
                {
                    artistData.singles.map((single, index) => (
                        <SingleCard name={single.name} cover={single.cover} key={index} />
                    ))
                }
                </ul>
                
            </div>
        </>
    )
}

export const AlbumCard = (props) => {
    return (
        <li className='album-card'>
            <a className='album-card-tag'>
                <img src={props.cover} className='album-card-cover'></img>
                <h3 className='album-card-title'>{props.name}</h3>
            </a>
        </li>
    )
}

export const SingleCard = (props) => {
    return (
        <li className='single-card'>
            <a className='single-card-tag'>
                <img src={props.cover} className='single-card-cover'></img>
                <h3 className='single-card-title'>{props.name}</h3>
            </a>
        </li>
    )
}