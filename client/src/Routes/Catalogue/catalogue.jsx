import { useState, useEffect, useRef } from 'react';
import { useArtistContext } from '../../Context/artist-context';
import { CSSTransition } from "react-transition-group"
import { Subnav, SubnavItem } from './subnav';
import { icons } from '../../assets/icons';
import './catalogue.css'

export const Catalogue = () => {

    // if includeAlbums is false, dont even bother checking individual album bools
    const { artist, setArtist, artistData, setArtistData, setIncluded, enableAlbums, setEnableAlbums, enableSingles, setEnableSingles } = useArtistContext();

    const beginRanking = () => {
        
    }

    return (
        <>
            <div className='catalogue-settings'>
                <h2 className='settings-header'>Artist Options</h2>
                <span className='settings-desc'>{"Deselect the albums/singles you want to exclude from the ranking pool. Don't worry about individual album songs, you'll eliminate more songs in the next step."}</span>
                <Subnav>
                    <SubnavItem
                        primary="Exclude Albums"
                        secondary="Include Albums"
                        function={() => {
                            setEnableAlbums(!enableAlbums);
                        }}
                    />
                    <SubnavItem
                        primary="Exclude Singles"
                        secondary="Include Singles"
                        function={() => {
                            setEnableSingles(!enableSingles);
                        }}
                    />
                    <a className='begin-ranking-button'>
                        Begin Ranking
                        <img className='begin-ranking-button-img' src={icons.play} />
                    </a>
                </Subnav>
            </div>
            <div className='catalogue'>
                <h2 className='catalogue-header'>Albums</h2>
                <ul className='catalogue-albums'>
                {
                    artistData.albums.map((album, index) => (
                        <AlbumCard 
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
                        <SingleCard 
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

export const AlbumCard = (props) => {

    const { setIncluded, enableAlbums } = useArtistContext()
    const albumRef = useRef(null)

    const [isIncluded, setIsIncluded] = useState(props.isIncluded);

    const toggleInclude = () => {
        setIsIncluded(!isIncluded);
        setIncluded(props.category, props.id, !isIncluded);
    }

    useEffect(() => {
        if(isIncluded != enableAlbums) {
            toggleInclude(!isIncluded);
        }
    }, [enableAlbums])

    return (
        <CSSTransition 
            nodeRef={albumRef}
            in={!isIncluded}
            timeout={300}
            classNames="album-card"
        >
            <li className='album-card' ref={albumRef}>
                <a className='album-card-tag' onClick={toggleInclude}>
                    <img src={props.cover} className='album-card-cover'></img>
                    <h3 className='album-card-title'>{props.name}</h3>
                </a>
            </li>
        </CSSTransition>
        
    )
}

export const SingleCard = (props) => {

    const { setIncluded, enableSingles } = useArtistContext()
    const singleRef = useRef(null)

    const [isIncluded, setIsIncluded] = useState(props.isIncluded);

    const toggleInclude = () => {
        setIsIncluded(!isIncluded);
        setIncluded(props.category, props.id, !isIncluded);
    }

    useEffect(() => {
        if(isIncluded != enableSingles) {
            toggleInclude(!isIncluded);
        }
    }, [enableSingles])

    return (
        <CSSTransition 
            nodeRef={singleRef}
            in={!isIncluded}
            timeout={300}
            classNames="single-card"
        >
            <li className='single-card' ref={singleRef}>
                <a className='single-card-tag' onClick={toggleInclude}>
                    <img src={props.cover} className='single-card-cover'></img>
                    <h3 className='single-card-title'>{props.name}</h3>
                </a>
            </li>
        </CSSTransition>
    )
}