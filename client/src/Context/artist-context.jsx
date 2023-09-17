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
        albumSingles:[],
        singles:[],
    });

    const setIncluded = (category, id, bool) => {
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

    return (
        <ArtistContext.Provider
            value={
                {artist, setArtist, 
                artistLoaded, setArtistLoaded,
                picture, setPicture, 
                id, setId, 
                artistData, setArtistData, setIncluded,
                enableAlbums, setEnableAlbums, enableSingles, setEnableSingles
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