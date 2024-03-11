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

    const [globalCustomSongs, setGlobalCustomSongs] = useState(new Map());

    const [songCount, setSongCount] = useState(0);

    // Reset all artist data. 
    const refresh = () => {
        setArtist('');
        setArtistLoaded(false);
        setPicture('');
        setId('');
        setEnableAlbums(true);
        setEnableSingles(true);
        setFinalSongs(new Map());
        setGlobalCustomSongs(new Map());
        setSongCount(0);
    }

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

    // keeps finalSongs updated between page reloads
    // used on customize page
    const createFinalSongs = () => {
        let songCount = 0;
        let songs = {};
        // hash table to help look up duplicates in O(1)
        let songTitles = {};
        for (const album of artistData.albums) {
            if (!album.isIncluded) {
            continue;
            }
            for (const track of album.tracks) {
                if (!(track.name in songTitles)) {
                    songs[songCount] = {
                    name:track.name,
                    artists: track.artists,    
                    album: album.name,
                    cover: album.cover,
                    isIncluded: true,
                    };

                    songTitles[track] = track;

                    songCount++;
                }
            }
        }
        
        for (const single of artistData.singles) {

            if (!single.isIncluded) {
                continue;
                }
            if (!(single.name in songTitles)) {
                songs[songCount] = {
                name:single.name,    
                cover: single.cover,
                artists: single.artists,   
                isIncluded: true,
                };

                songTitles[single.name] = single.name;

                songCount++;
            }
        }

        // keeps songCount in sync when user switches pages
        for(const key in globalCustomSongs){
            if(globalCustomSongs[key].isIncluded) {
                songCount++;
            }
        }

        setSongCount(songCount);
        setFinalSongs(songs);
    }

    // used on ranking page
    const updateFinalSongs = () => {
        let currFinalSongs = {...finalSongs};
        for(const key in globalCustomSongs){
            currFinalSongs[key] = globalCustomSongs[key]
        }
        setFinalSongs(currFinalSongs);
    }

    const addGlobalCustomSong = (songTitle) => {

        let data = {
            name: songTitle,
            cover: null,
            isIncluded: true
        }
        let id = songCount + 1

        let gcsCopy = {...globalCustomSongs}
        gcsCopy[id] = data;

        setGlobalCustomSongs(gcsCopy);
        setSongCount(songCount + 1);
    
        return {
            songId: id,
            songData: data
        };
    }

    const toggleGlobalCustomSong = (id) => {
        let data = {...globalCustomSongs}
        data[id].isIncluded = !data[id].isIncluded;
        setGlobalCustomSongs(data);
    }

    const clearArtistData = () => {
        setArtistData({});
        setFinalSongs({});
        setGlobalCustomSongs({});
        setArtist('');
        setArtistLoaded(false);
        setPicture('');
        setId('');
        setEnableAlbums(true);
        setEnableSingles(true);
        setSongCount(0);
    }

    const checkDupe = (songTitle, songArr) => {

        for(const [key, value] of Object.entries(finalSongs)){
            if(songTitle.toLowerCase() === value.name.toLowerCase()){
                return false;
            }
        }
        return true;
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
                finalSongs, setFinalSongs, createFinalSongs, updateFinalSongs,
                globalCustomSongs, setGlobalCustomSongs, addGlobalCustomSong, toggleGlobalCustomSong,
                clearArtistData,
                songCount,
                refresh
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