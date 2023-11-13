
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom"
import { useArtistContext } from '../../Context/artist-context';
import './customize.css';

export const Customize = (props) => {

    let navigate = useNavigate();

    const { artist, setArtist, artistData, picture, setArtistData, setIncluded, enableAlbums, setEnableAlbums, enableSingles, setEnableSingles, finalSongs, createFinalSongs, addFinalSong } = useArtistContext();

    const [songCount, setSongCount] = useState(0);

    useEffect(() => {
        createFinalSongs();
        const tabulateSongTotals = () => {
            let count = 0;
            for(const album of artistData.albums){
                if(album.isIncluded){
                    count += album.tracks.length;
                }
            }
            for(const single of artistData.singles){
                if(single.isIncluded){
                    count += 1;
                }
            }
            setSongCount(count);
        }
        tabulateSongTotals();
    }, []);

    

    return (
        <div className='customize-container'>
            <h2>Customize</h2>
            <div className='artist-container'>
                <img src={picture} className='artist-picture'></img>
                <ul className='artist-data'>
                    <li className='artist-bit'>
                        <div className='artist-bit-title'>Your Artist:</div>
                        <h2 className='artist-bit-desc'>{artist}</h2>
                    </li>
                    <li className='artist-bit'>
                        <div className='artist-bit-title'>Songs To Rank:</div>
                        <h2 className='artist-bit-desc'>{songCount}</h2>
                    </li>
                    
                </ul>
            </div>
        </div>
    )
}