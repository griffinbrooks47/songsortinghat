import { useState, useEffect } from "react";
import { useArtistContext } from "../../Context/artist-context";
import { motion } from 'framer-motion';

import './ranking.css'

export const Ranking = () => {

    const { updateFinalSongs, finalSongs, songCount } = useArtistContext();

    const [stage, setStage] = useState(songCount > 10 ? true : false);

    const setStageTwo = () => {
        setStage(false);
    }

    useEffect(() => {
        updateFinalSongs();
    }, []);

    return (
        <main className="ranking">
            {stage ? (
                <StageOne 
                    capacity={12}
                    setStageTwo={setStageTwo}
                />
                ) : (
                <StageTwo />
            )}
        </main>
    )
}

export const StageOne = (props) => {

    const { finalSongs } = useArtistContext();

    // index represents global song ID
    const [songs, setSongs] = useState(new Map());

    const [currIteration, setCurrIteration] = useState(null);

    const nextIteration = () => {
        // switches to next stage
        if(currIteration >= Object.keys(songs).length-1){
            props.setStageTwo();
        } else {
            setCurrIteration(currIteration + 1);
        }
    }

    const prevIteration = () => {
        if(currIteration > 0){
            setCurrIteration(currIteration - 1);
        }
    }

    const toggleIncluded = (stage, innerId) => {
        let currSongs = {...songs}
        console.log(currSongs[stage][innerId][2]);
        currSongs[stage][innerId][2] = !currSongs[stage][innerId][2];
        setSongs(currSongs)
        console.log(currSongs);
    }

    useEffect(() => {

        let totalSongCount = Object.keys(finalSongs).length;

        // randomize the IDs prior to generating each stage one page
        let randSongIds = Object.keys(finalSongs).sort(() => 0.5 - Math.random());
        let songCounter = 0;
        let iteration = 0;
        let currSongs = {};
        while(songCounter < totalSongCount){
            let currSongsIteration = [];
            if((totalSongCount-songCounter)/props.capacity >= 1) {
                
                for(let i = 0; i < props.capacity; i++){
                    let songId = randSongIds[songCounter]
                    currSongsIteration.push([songId, finalSongs[songId], false]);
                    songCounter++;
                }
                

            } else {
                let finalCount = totalSongCount - songCounter;
                for(let i = 0; i < finalCount; i++){
                    let songId = randSongIds[songCounter]
                    currSongsIteration.push([songId, finalSongs[songId], false]);
                    songCounter++;
                }
            }
            currSongs[iteration] = currSongsIteration;
            iteration++;
        }
        console.log(currSongs)
        setSongs(currSongs);
        setCurrIteration(0);
    }, [])

    return (
        <div className="stage-one">
            <h2 className="stage-one-header">Choose Your Favorites</h2>
            <div className="stage-one-desc">
                Songs selected will continue to the final ranking stage!
            </div>
            <hr className="stage-one-divider"></hr>
            <ul className="stage-one-buttons">
                <li className="stage-one-button">
                    <a className="stage-one-button-tag" onClick={prevIteration}>
                        Back
                    </a>
                </li>
                <li className="stage-one-button">
                    <a className="stage-one-button-tag" onClick={nextIteration}>
                        Next
                    </a>
                </li>
            </ul>
            <ul className="stage-one-song-grid">
                {currIteration !== null ? (
                    songs[currIteration].map(([id, song, included], index) => (
                        <StageOneSong 
                            key={index + props.capacity*currIteration} 
                            id={id}
                            innerId={index}
                            stage={currIteration}
                            name={song.name}
                            cover={song.cover}
                            isIncluded={included}
                            toggleIncluded={toggleIncluded}
                        />
                            
                    ))
                ) : (
                    <div>
                        Loading...
                    </div>
                )}
            </ul>
        </div>
    )
}

export const StageOneSong = (props) => {

    const [active, setActive] = useState(props.isIncluded);

    const variants = {
        off: { opacity: 0.3, scale: 1},
        on: { opacity: 1, scale: 1 },
      };

    const toggleActive = () => {
        console.log(active);
        props.toggleIncluded(props.stage, props.innerId)
        setActive(!active);
    }

    return (
        <motion.div
            initial="off"
            animate={active ? "on" : "off"}
            variants={variants}
        >
            <li className="stage-one-song">
                <a className="stage-one-song-tag" onClick={toggleActive}>
                    <img src={props.cover} className="stage-one-song-cover"></img>
                    <div className="stage-one-song-title">
                        {props.name}
                    </div>
                </a>
            </li>
        </motion.div>
    )
}



export const StageTwo = () => {
    return (
        <div className="stage-two">
            Stage2
        </div>
    )
}