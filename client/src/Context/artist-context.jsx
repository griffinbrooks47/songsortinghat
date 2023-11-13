import { useContext, createContext, useState } from 'react'

const ArtistContext = createContext(null)

// each button shoud be a component with an individual activated state.
// each component is tied to a song/album in the glabal artistData context

export default function ArtistContextProvider(props){
    const [artist, setArtist] = useState('');
    const [artistLoaded, setArtistLoaded] = useState(false);
    const [picture, setPicture] = useState('');
    const [id, setId] = useState('');
    const [enableAlbums, setEnableAlbums] = useState(true);
    const [enableSingles, setEnableSingles] = useState(true);
    // list of song objects, each with an eliminated state
    const [artistData, setArtistData] = useState({
        albums:[],
        singles:[]
    });

    // key : song title
    const [finalSongs, setFinalSongs] = useState(new Map());

    const setGlobalIncluded = (category, id, bool) => {
        let copyData = artistData;
        if(category == 'album'){
            copyData.albums[id].isIncluded = bool
            setArtistData(copyData)
        }
        if(category == 'single'){
            copyData.singles[id].isIncluded = bool
            setArtistData(copyData)
        }
    }

    const createFinalSongs = () => {
        let songs = {}; // Make a copy of the current state
      
        for (const album of artistData.albums) {
            if (!album.isIncluded) {
            continue;
            }
        
            for (const track of album.tracks) {
                if (!(track in songs)) {
                    songs[track] = {
                    album: album.name,
                    cover: album.cover,
                    isIncluded: true,
                    };
                }
            }
        }
        
        for (const single of artistData.singles) {
            if (!(single.name in songs)) {
                songs[single.name] = {
                cover: single.cover,
                isIncluded: true,
            };
            }
        }
        setFinalSongs(songs);
    }
      

    const addFinalSong = (finalSong) => {
        let finalSongsCopy = {...finalSongs}
        finalSongsCopy[finalSong] = {}
        setFinalSongs(finalSongsCopy);
    }
     

    return (
        <ArtistContext.Provider
            value={
                {artist, setArtist, 
                artistLoaded, setArtistLoaded,
                picture, setPicture, 
                id, setId, 
                artistData, setArtistData, setGlobalIncluded,
                enableAlbums, setEnableAlbums, enableSingles, setEnableSingles,
                finalSongs, setFinalSongs, createFinalSongs, addFinalSong
                }
            }
        >
            {props.children}
        </ArtistContext.Provider>
    )
}

export const useArtistContext = () => {
    const context = useContext(ArtistContext);
    if(!context){
        throw new Error(
            "ArtistContext must be used within an ArtistContextProvider"
        )
    }
    return context;
}