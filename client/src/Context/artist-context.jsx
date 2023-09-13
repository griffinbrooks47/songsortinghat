import { useContext, createContext, useState } from 'react'

const ArtistContext = createContext(null)

export default function ArtistContextProvider(props){
    const [artist, setArtist] = useState('');
    const [artistLoaded, setArtistLoaded] = useState(false);
    const [picture, setPicture] = useState('');
    const [id, setId] = useState('');
    // list of song objects, each with an eliminated state
    const [artistData, setArtistData] = useState({
        albums:[],
        singles:[],
    });

    return (
        <ArtistContext.Provider
            value={
                {artist, setArtist, 
                artistLoaded, setArtistLoaded,
                picture, setPicture, 
                id, setId, 
                artistData, setArtistData}
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