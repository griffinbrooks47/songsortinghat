import { useState, useEffect, useRef } from 'react';
import { useArtistContext } from '../../Context/artist-context';
import { CSSTransition } from "react-transition-group"
import { Subnav, SubnavItem, FramerSubNavItem } from './SubNavBar/subnav';
import { useNavigate, Link } from "react-router-dom"
import { icons } from '../../assets/icons';
import { motion } from 'framer-motion';
import './catalogue.css'
import './catalogue_transitions.css'    
import './framer-catalogue.css'

export const Catalogue = () => {

    // if includeAlbums is false, dont even bother checking individual album bools
    const { artist, setArtist, artistData, setArtistData, setIncluded, enableAlbums, setEnableAlbums, enableSingles, setEnableSingles } = useArtistContext();

    let navigate = useNavigate();

    return (
        <>
            <div className='catalogue-settings'>
                <h2 className='settings-header'>Artist Options</h2>
                <div className='settings-desc'>
                    <div>{"This is your chance to remove any albums or singles you'd like to exclude from the ranking pool. You can add songs to account for unreleased music in the next step!"}</div>
                    <div>{"Note: Deluxe albums do not need to be deselected, duplicate songs are automatically removed!"}</div>
                </div>
                
                <Subnav>
                    <FramerSubNavItem
                        primary="Remove Albums"
                        secondary="Add Albums"
                        state={enableAlbums}
                        function={(state) => {
                            setEnableAlbums(state);
                        }}
                    />
                    <FramerSubNavItem
                        primary="Remove Singles"
                        secondary="Add Singles"
                        state={enableSingles}
                        function={(state) => {
                            setEnableSingles(state);
                        }}
                    />
                    <Link to={'/customize'} className='begin-ranking-button'>Continue
                        <img className='begin-ranking-button-img' src={icons.play} />
                    </Link>
                </Subnav>
            </div>
            <div className='catalogue'>
                <h2 className='catalogue-header'>Albums</h2>
                <ul className='catalogue-albums'>
                {
                    artistData.albums.map((album, index) => (
                        <FramerAlbumCard 
                            name={album.name} 
                            cover={album.cover} 
                            isIncluded={album.isIncluded} 
                            id={album.id} 
                            category={album.category} 
                            key={index} 
                        />
                    ))
                }
                </ul>
                <h2 className='catalogue-header'>Singles</h2>
                <ul className='catalogue-singles'>
                {
                    artistData.singles.map((single, index) => (
                        <FramerSingleCard
                            name={single.name} 
                            cover={single.cover} 
                            isIncluded={single.isIncluded}
                            id={single.id} 
                            category={single.category} 
                            key={index} 
                        />
                    ))
                }
                </ul>
                
            </div>
        </>
    )
}

const FramerAlbumCard = (props) => {

    const { setGlobalIncluded, enableAlbums, artistData} = useArtistContext()

    const [active, setActive] = useState(props.isIncluded);

    const variants = {
        off: { opacity: 0.2, scale: 1},
        on: { opacity: 1, scale: 1 },
      };

    const toggleActive = () => {
        setActive(!active);
        setGlobalIncluded(props.category, props.id, !active);
    }

    useEffect(() => {
        if(props.isIncluded != enableAlbums){
            toggleActive();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enableAlbums])

    return (
        <motion.div
                initial="off" // Initial animation state
                animate={active ? "on" : "off"} // Animation state based on isOn
                variants={variants}
            >
            <li className='framer-album-card'>
                <a className='album-card-tag' onClick={toggleActive}>
                    <img src={props.cover} className='album-card-cover' loading='lazy'></img>
                    <h3 className='album-card-title'>{props.name}</h3>
                </a>
                
            </li>
        </motion.div>
    )
}

const FramerSingleCard = (props) => {

    const { setGlobalIncluded, enableSingles, artistData } = useArtistContext()

    const [active, setActive] = useState(props.isIncluded);

    const variants = {
        off: { opacity: 0.2, scale: 1},
        on: { opacity: 1, scale: 1 },
      };

    const toggleActive = () => {
        setActive(!active);
        setGlobalIncluded(props.category, props.id, !active);
    }

    useEffect(() => {
        if(props.isIncluded != enableSingles){
            toggleActive();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enableSingles])

    return (
        <motion.div
                initial="off" // Initial animation state
                animate={active ? "on" : "off"} // Animation state based on isOn
                variants={variants}
            >
            <li className='framer-single-card'>
                
                <a className='single-card-tag' onClick={toggleActive}>
                    <img src={props.cover} className='single-card-cover' loading='lazy'></img>
                    <h3 className='single-card-title'>{props.name}</h3>
                </a>
                
            </li>
        </motion.div>
    )
}