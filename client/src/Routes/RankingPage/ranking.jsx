import { useState, useEffect } from "react";
import { useArtistContext } from "../../Context/artist-context";
import { motion } from 'framer-motion';

import './ranking.css'

export const Ranking = () => {

    const { updateFinalSongs, finalSongs, songCount } = useArtistContext();

    const [stageTwoSongs, setStageTwoSongs] = useState([]);

    const [stage, setStage] = useState(songCount > 10 ? true : false);

    const setStageTwo = (songCandidates) => {
        console.log(finalSongs)
        setStageTwoSongs(songCandidates);
        setStage(false);
    }

    useEffect(() => {
        updateFinalSongs();
    }, []);

    return (
        <main className="ranking">
            {stage ? (
                <StageOne 
                    capacity={20}
                    setStageTwo={setStageTwo}
                />
                ) : (
                <StageTwo 
                    candidates={stageTwoSongs}
                />
            )}
        </main>
    )
}

export const StageOne = (props) => {

    const { finalSongs, songCount } = useArtistContext();

    // index represents global song ID
    const [songs, setSongs] = useState(new Map());

    const [currIteration, setCurrIteration] = useState(null);

    const nextIteration = () => {
        // switches to next stage
        if(currIteration >= Object.keys(songs).length-1){
            const candidates = createCandidates();
            props.setStageTwo(candidates);
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
        currSongs[stage][innerId][2] = !currSongs[stage][innerId][2];
        setSongs(currSongs)
    }

    const createCandidates = () => {

        let candidates = [];

        for(const pageIdx in songs){
            for(const innerIdx in songs[pageIdx]){
                if(songs[pageIdx][innerIdx][2]){
                    candidates.push(songs[pageIdx][innerIdx][1])
                }
            }
        }
        return candidates;
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
        setSongs(currSongs);
        setCurrIteration(0);
    }, [])

    return (
        <div className="stage-one">
            <h2 className="stage-one-header">Choose Your Favorites</h2>
            <div className="stage-one-desc">
                The songs you select will continue to the final ranking stage. <br></br> Note: Selecting a large number of songs may make the next stage take a long time. Choose wisely!
            </div>
            <hr className="stage-one-divider"></hr>
            <ul className="stage-one-buttons">
                {
                    (currIteration != 0 &&
                        <li className="stage-one-button">
                            <a className="stage-one-button-tag" onClick={prevIteration}>
                                Back
                            </a>
                        </li>
                        )
                }
                
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
        off: { 
            opacity: 0.4,
            scale: 1,
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        },
        on: { 
            opacity: 1, 
            scale: 1,
            boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
        },
      };

    const styles = {
        alignItems: 'center',
        width: 'fit-content',
        height: 'fit-content',
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: '0.4rem',
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
            style={styles}
        >
            <a className="stage-one-song-tag" onClick={toggleActive}>
                <img src={props.cover} className="stage-one-song-cover" loading='lazy'></img>
                <div className="stage-one-song-title">
                    {props.name}
                </div>
            </a>
        </motion.div>
    )
}



export const StageTwo = (props) => {

     // temporary REMOVE WHEN COMPLETE
     const [devSongData, setDevSongData] = useState(

        {
            "ITAKY": {
                "above": [],
                "below": [],
                "score": 0,
                "missing": [
                    "Yikes",
                    "All Mine",
                    "Wouldn't Leave",
                    "No Mistakes",
                    "Ghost Town",
                    "Violent Crimes"
                ],
                "pass": false,
                "rank": null,
                "data": {
                    "album": "ye",
                    "cover": "https://i.scdn.co/image/ab67616d0000b2730cd942c1a864afa4e92d04f2",
                    "artists": "Kanye, Benny Blanco, Quavo, Takeoff, Offset, Justin Timberlake"
                }
            },
            "Yikes": {
                "above": [],
                "below": [],
                "score": 0,
                "missing": [
                    "I Thought About Killing You",
                    "All Mine",
                    "Wouldn't Leave",
                    "No Mistakes",
                    "Ghost Town",
                    "Violent Crimes"
                ],
                "pass": false,
                "rank": null,
                "data": {
                    "album": "ye",
                    "cover": "https://i.scdn.co/image/ab67616d0000b2730cd942c1a864afa4e92d04f2",
                    "artists": "Kanye, Drake"
                }
            },
            "All Mine": {
                "above": [],
                "below": [],
                "score": 0,
                "missing": [
                    "I Thought About Killing You",
                    "Yikes",
                    "Wouldn't Leave",
                    "No Mistakes",
                    "Ghost Town",
                    "Violent Crimes"
                ],
                "pass": false,
                "rank": null,
                "data": {
                    "album": "ye",
                    "cover": "https://i.scdn.co/image/ab67616d0000b2730cd942c1a864afa4e92d04f2"
                }
            },
            "Wouldn't Leave": {
                "above": [],
                "below": [],
                "score": 0,
                "missing": [
                    "I Thought About Killing You",
                    "Yikes",
                    "All Mine",
                    "No Mistakes",
                    "Ghost Town",
                    "Violent Crimes"
                ],
                "pass": false,
                "rank": null,
                "data": {
                    "album": "ye",
                    "cover": "https://i.scdn.co/image/ab67616d0000b2730cd942c1a864afa4e92d04f2"
                }
            },
            "No Mistakes": {
                "above": [],
                "below": [],
                "score": 0,
                "missing": [
                    "I Thought About Killing You",
                    "Yikes",
                    "All Mine",
                    "Wouldn't Leave",
                    "Ghost Town",
                    "Violent Crimes"
                ],
                "pass": false,
                "rank": null,
                "data": {
                    "album": "ye",
                    "cover": "https://i.scdn.co/image/ab67616d0000b2730cd942c1a864afa4e92d04f2"
                }
            },
            "Ghost Town": {
                "above": [],
                "below": [],
                "score": 0,
                "missing": [
                    "I Thought About Killing You",
                    "Yikes",
                    "All Mine",
                    "Wouldn't Leave",
                    "No Mistakes",
                    "Violent Crimes"
                ],
                "pass": false,
                "rank": null,
                "data": {
                    "album": "ye",
                    "cover": "https://i.scdn.co/image/ab67616d0000b2730cd942c1a864afa4e92d04f2"
                }
            },
            "Violent Crimes": {
                "above": [],
                "below": [],
                "score": 0,
                "missing": [
                    "I Thought About Killing You",
                    "Yikes",
                    "All Mine",
                    "Wouldn't Leave",
                    "No Mistakes",
                    "Ghost Town"
                ],
                "pass": false,
                "rank": null,
                "data": {
                    "album": "ye",
                    "cover": "https://i.scdn.co/image/ab67616d0000b2730cd942c1a864afa4e92d04f2"
                }
            }
        }

    )
    const initDevData = () => {
        return devSongData;
    }

    const { finalSongs, songCount } = useArtistContext();

    const initStageTwoSongs = () => {
        if(props.candidates.length > 0) {
            return props.candidates
        }
        let candidates = [];
        for(const key in finalSongs) {
            candidates.push(finalSongs[key]);
        }
        return candidates;
    }
    const initSongData = () => {
        let candidates = initStageTwoSongs();
        setStageTwoSongs(candidates);
        let currSongData = {};
        for(const candidate of candidates){
            let missingCandidates = [...candidates];
            let missingIdx = missingCandidates.indexOf(candidate)
            if (missingIdx !== -1) {
                missingCandidates.splice(missingIdx, 1);
              }

            let missingFinal = [];

            for(const missingCandidate of missingCandidates){
                missingFinal.push(missingCandidate.name);
            }

            currSongData[candidate.name] = {
                above:[],
                below:[],
                score:0,
                missing:missingFinal,
                pass:false,
                rank:null,
                data:{
                    album:candidate.album,
                    cover:candidate.cover,
                    artists:candidate.artists
                }
            }
        }
        return currSongData;
    }

    // generates final candidates directly from global finalSongs
    const [stageTwoSongs, setStageTwoSongs] = useState([]);

    // react variables
    const [choiceOne, setChoiceOne] = useState('');
    const [choiceTwo, setChoiceTwo] = useState('');

    // algorithm variables

    //* USE  OR initSongData
    const [songData, setSongData] = useState(() => initSongData());

    const [ranking, setRanking] = useState(true);
    const [skips, setSkips] = useState([]);
    const [prevLowest, setPrevLowest] = useState("");
    const [prevHighest, setPrevHighest] = useState("");

    const findLowestScore = (exclude) => {
        let songDataCopy = {...songData};
        if(exclude.length > 0) {
            for(const excludeSong of exclude) {
                delete songDataCopy[excludeSong];
            }
        }

        let minKey = null;
        let minValue = songCount+1;

        for (const songDataKey in songDataCopy) {
            let currentValue = songDataCopy[songDataKey]['score'];
            if (currentValue < minValue) {
              minValue = currentValue;
              minKey = songDataKey;
            }
        }

        return minKey;
    }
    const findHighestPotential = (excluded, lowest) => {

        let songDataCopy = {...songData};

        let missingSongs = songDataCopy[lowest]['missing'];

        for(const exclusion in excluded) {
            if(exclusion in missingSongs){
                let removeIdx = missingSongs.indexOf(exclusion);
                if(removeIdx !== -1){
                    missingSongs.splice(removeIdx, 1);
                }
            }
        }

        let minData = null;
        let minValue = songCount+1;

        for (const missingData of missingSongs) {
            let currentValue = songDataCopy[missingData]['score'];
            if (currentValue < minValue) {
              minValue = currentValue;
              minData = missingData;
            }
        }

        return minData;

    }
    const setChoices = (songDataObj) => {

        let lowest_skips = [];

        for(const songDataKey in songDataObj){
            if(songDataObj[songDataKey]['pass'] == true){
                lowest_skips.push(songDataKey);
            }
        }

        let lowest = findLowestScore(lowest_skips);
        let skips = [lowest,];

        let highest = findHighestPotential(skips, lowest);

        console.log(lowest, highest);

        setChoiceOne(lowest);
        setChoiceTwo(highest);
    }

    // choice is either 1 or 2
    const iteration = (choice) => {
        console.log(choice);
    }

    useState(() => {
        let songDataCopy = {...songData};
        setChoices(songDataCopy);
    }, [])

    return (
        <div className="stage-two">
            <h2 className="stage-two-header">Pick The Better Song</h2>
            
            <hr className="stage-two-divider"></hr>
           
            {(choiceOne != '' || choiceTwo != '') && (
                <ul className="stage-two-options">
                    <StageTwoChoice 
                        title={choiceOne}
                        data={songData[choiceOne]['data']}
                        iteration={()=>{
                            iteration(1);
                        }}
                    />
                    <StageTwoChoice 
                        title={choiceTwo}
                        data={songData[choiceTwo]['data']}
                        iteration={()=>{
                            iteration(2);
                        }}
                    />
                </ul>
            )}

        </div>
    )
}

export const StageTwoChoice = (props) => {
    return (
        <li className="stage-two-option">
            <a className="stage-two-option-tag" onClick={() => {
                props.iteration();
                console.log(props.data);
            }}>
                <img className="stage-two-option-img"
                    src={props.data.cover}
                ></img>

                <div className="stage-two-option-data">
                    <div className="stage-two-option-title">
                        {props.title}
                    </div>
                    <div className="stage-two-option-artists">
                        {props.data.artists}
                    </div>
                </div>
            </a>
        </li>
    )
}