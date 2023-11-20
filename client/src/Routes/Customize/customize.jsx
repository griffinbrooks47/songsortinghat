
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom"
import { useArtistContext } from '../../Context/artist-context';
import { useForm } from 'react-hook-form'
import { yupResolver} from '@hookform/resolvers/yup'
import { motion } from 'framer-motion';
import * as yup from 'yup'
import './customize.css';

export const Customize = (props) => {

    let navigate = useNavigate();

    const { artist, picture, createFinalSongs, globalCustomSongs, addGlobalCustomSong, toggleGlobalCustomSong, songCount } = useArtistContext();

    const [customSongs, setCustomSongs] = useState([]);

    const [excluded, setExcluded] = useState(0);

    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        console.log('toggled')
        setModal(!modal);
        document.body.style.overflow = modal ? 'auto' : 'hidden';
    }


    const addCustomSong = (songTitle) => {
        let {songId, songData} = addGlobalCustomSong(songTitle);
        setCustomSongs([...customSongs, {...songData, id:songId}])
    }

    const toggleCustomSong = (id, bool) => {
        toggleGlobalCustomSong(id);
        if(!bool){
            setExcluded(excluded+1);
        } else {
            setExcluded(excluded-1);
        }
    }

    // keeps customSongs in sync with global data when user switches pages
    const updateCustomSongs = () => {
        let customSongsUpdate = [];
        for(const key in globalCustomSongs){

            let globalCustomData = {
                ...globalCustomSongs[key],
                id: key
            }
            customSongsUpdate.push(globalCustomData)
        }
        setCustomSongs(customSongsUpdate)
    }

    // runs every time page is loaded
    useEffect(() => {
        createFinalSongs();
        updateCustomSongs();
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
                        <h2 className='artist-bit-desc'>{songCount-excluded}</h2>
                    </li>
                    
                </ul>
            </div>
            <div className='custom-song-header'>Custom Songs</div>
            <div className='custom-song-desc'>
                {`Here's your chance to add songs not currently on spotify!`}
            </div>
            <ul className='custom-song-buttons'>
                <li className='custom-song-button-container'>
                    <a className='custom-song-button' onClick={toggleModal}>
                        Add Custom Song
                    </a>
                </li>
                <li className='custom-song-button-container'>
                    <a className='custom-song-button'>
                        Clear Custom Songs
                    </a>
                </li>
                <li className='custom-song-button-container'>
                    <Link to={'/ranking'} className='begin-ranking-button'>
                        Start Ranking
                    </Link>
                </li>
            </ul>
            
            {modal && <CustomSongModal 
                func={addCustomSong}
                state={modal}
                toggleModal={toggleModal}
            />}
            <ul className='custom-songs-container'>
                {customSongs.map(
                    (item, index) => {
                        return (
                            <CustomSong
                                key={index}
                                id={item.id}
                                name={item.name}
                                isIncluded={item.isIncluded}
                                func={toggleCustomSong}
                            >
                                {item.name}
                            </CustomSong>
                        )
                    }
                )}
            </ul>
        </div>
    )
}

export const CustomSong = (props) => {

    const [active, setActive] = useState(props.isIncluded);

    const toggleActive = () => {
        props.func(props.id, !active);
        setActive(!active);
    }

    const variants = {
        off: { opacity: 0.2, scale: 1},
        on: { opacity: 1, scale: 1 },
      };

    return (
        <motion.div
            initial="off"
            animate={active ? "on" : "off"}
            variants={variants}
        >
            <li className='custom-song'>
                <a className='custom-song-tag' onClick={toggleActive}>
                    {props.name}
                </a>
            </li>
        </motion.div>
        
    )

}

export const CustomSongModal = (props) => {

    const { artistData } = useArtistContext();

    const schema = yup.object().shape({
        name: yup.string().required()
    }) 

    const { register, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        props.func(data.name);
        reset();
        props.toggleModal();
    }

    return (
        <>
            <div className='custom-song-modal-overlay'>
                <div className='custom-song-modal'>
                    <h3 className='custom-song-modal-header'>Create Custom Song</h3>
                    <div className='custom-song-modal-field'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>Song Title:</div>
                            <input type='text' placeholder='e.g. Dance Now' {...register("name")}></input>
                            <div>Optional Album Title:</div>
                            <select {...register("album")}>
                                <option value={"none"}>
                                    None
                                </option>
                                {artistData.albums.map(
                                    (album, index) => {
                                        return (
                                            <option key={index}
                                                value={album.name}
                                            >
                                                {album.name}
                                            </option>
                                        )
                                    }
                                )}
                            </select>
                        </form>
                    </div>
                    <div className='custom-song-modal-buttons'>
                        <a className='custom-song-modal-button' onClick={handleSubmit(onSubmit)}>
                            Add Song
                        </a>
                        <a className='custom-song-modal-button' onClick={props.toggleModal}>
                            Cancel
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}