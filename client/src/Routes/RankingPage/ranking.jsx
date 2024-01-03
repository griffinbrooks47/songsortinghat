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
                rank:null
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
    const inherit = (winner, loser, songDataObj) => {

        // need winner aboves in loser aboves
        // need loser belows in winner belows

        const winnerAboves = songDataObj[winner]['above'];
        
        for(const winnerAbove of winnerAboves){
            if(songDataObj[loser]['missing'].includes(winnerAbove)){
                songDataObj[loser]['above'].push(winnerAbove);

                console.log("" + loser + " inherits above " + winnerAbove)
                
                let missingIdx = songDataObj[loser]['missing'].indexOf(winnerAbove);
                songDataObj[loser]['missing'].splice(missingIdx, 1);

            }
        }

        const loserBelows = songDataObj[loser]['below'];

        for(const loserBelow of loserBelows){
            if(songDataObj[winner]['missing'].includes(loserBelow)){
                songDataObj[winner]['below'].push(loserBelow);

                console.log("" + winner + " inherits below " + loserBelow)

                let missingIdx = songDataObj[winner]['missing'].indexOf(loserBelow);
                songDataObj[winner]['missing'].splice(missingIdx, 1);
            }
        }

        //secondaryInherit(winner, loser, songDataObj);

        updateScores(songDataObj);
    }

    const secondaryInherit = (winner, loser, songDataObj) => {

        // go thru winner aboves list, each adds loserBelows to its below list
        // go thru loser below list, each adds winnerAboves to its above list

        let winnerAboves = songDataObj[winner]['above'];
        let loserBelows = songDataObj[loser]['below'];

        for(const winnerAbove of winnerAboves){

            let winnerAboveMissing = songDataObj[winnerAbove]['missing'];

            for(const loserBelow of loserBelows){

                let loserBelowBelows = songDataObj[loserBelow]['below'];

                for(const loserBelowBelow of loserBelowBelows){

                    console.log("searched")

                    if(winnerAboveMissing.includes(loserBelowBelow)){
                        
                        songDataObj[winnerAbove]['below'].push(loserBelowBelow)

                        console.log("Secondary Inherit: Above")

                        let missingIdx = songDataObj[winnerAbove]['missing'].indexOf(loserBelowBelow);
                        songDataObj[winnerAbove]['missing'].splice(missingIdx, 1);

                    }

                }

            }

        }

        for(const loserBelow of loserBelows){

            let loserBelowMissing = songDataObj[loserBelow]['missing'];

            for(const winnerAbove of winnerAboves){

                let winnerAboveAboves = songDataObj[winnerAbove]['above'];

                for(const winnerAboveAbove of winnerAboveAboves){

                    console.log("searched")

                    if(loserBelowMissing.includes(winnerAboveAbove)){
                        
                        songDataObj[loserBelow]['above'].push(winnerAboveAbove)

                        console.log("Secondary Inherit: Below")

                        let missingIdx = songDataObj[loserBelow]['missing'].indexOf(winnerAboveAbove);
                        songDataObj[loserBelow]['missing'].splice(missingIdx, 1);

                    }

                }

            }

        }       

        updateScores(songDataObj);
    }
    const updateScores = (songDataObj) => {

        for(const songDataKey in songDataObj){

            let above = songDataObj[songDataKey]['above'].length
            let below = songDataObj[songDataKey]['below'].length

            let score = above + below;

            songDataObj[songDataKey]['score'] = score;
            songDataObj[songDataKey]['match_score'] = score;

            songDataObj[songDataKey]['rank'] = 1 + above;

            let missingNum = songDataObj[songDataKey]['missing'].length;
            songDataObj[songDataKey]['pass'] = (missingNum == 0);

        }

        setSongData(songDataObj);

        if(ranking && checkIfFinished(songDataObj)){
            setChoices(songDataObj);
        } else {
            setRanking(false);
            console.log("Finished")
        }

    }

    const checkIfFinished = (songDataObj) => {
        
        let totalMissing = 0;

        for(const songDataKey in songDataObj){
            totalMissing += songDataObj[songDataKey]['missing'].length;
        }

        console.log(totalMissing);

        if(totalMissing == 0){
            return false;
        } else {
            return true;
        }
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

        let songDataCopy = {...songData};
        
        if(choice == 1){
            
            if(!songDataCopy[choiceOne]['below'].includes(choiceTwo)){
                
                songDataCopy[choiceOne]['below'].push(choiceTwo);

                if(songDataCopy[choiceOne]['missing'].includes(choiceTwo)){
                    let choiceTwoIdx = songDataCopy[choiceOne]['missing'].indexOf(choiceTwo);
                    songDataCopy[choiceOne]['missing'].splice(choiceTwoIdx, 1);
                }

            }

            if(!songDataCopy[choiceTwo]['above'].includes(choiceOne)){
                
                songDataCopy[choiceTwo]['above'].push(choiceOne);

                if(songDataCopy[choiceTwo]['missing'].includes(choiceOne)){
                    let choiceOneIdx = songDataCopy[choiceTwo]['missing'].indexOf(choiceOne);
                    songDataCopy[choiceTwo]['missing'].splice(choiceOneIdx, 1);
                }

            }

            inherit(choiceOne, choiceTwo, songDataCopy);

        } else if(choice == 2){

            if(!songDataCopy[choiceTwo]['below'].includes(choiceOne)){
                
                songDataCopy[choiceTwo]['below'].push(choiceOne);

                if(songDataCopy[choiceTwo]['missing'].includes(choiceOne)){
                    let choiceOneIdx = songDataCopy[choiceTwo]['missing'].indexOf(choiceOne);
                    songDataCopy[choiceTwo]['missing'].splice(choiceOneIdx, 1);
                }

            }

            if(!songDataCopy[choiceOne]['above'].includes(choiceTwo)){
                
                songDataCopy[choiceOne]['above'].push(choiceTwo);

                if(songDataCopy[choiceOne]['missing'].includes(choiceTwo)){
                    let choiceTwoIdx = songDataCopy[choiceOne]['missing'].indexOf(choiceTwo);
                    songDataCopy[choiceOne]['missing'].splice(choiceTwoIdx, 1);
                }

            }

            inherit(choiceTwo, choiceOne, songDataCopy);   

        } else {
            console.log("Invalid Choice");
        }

    }

    const completeRankings = () => {

    }

    return (
        <div className="stage-two">
            <button className="check-data" onClick={() => {

                let songDataCopy = {...songData};
                setChoices(songDataCopy);

            }}>
                SetChoices
            </button>
            <button onClick={()=>{
                console.log(songData);
            }}>
                Check Songs
            </button>
            <h2 className="stage-two-header">Pick The Better Song</h2>
            <hr></hr>
            <ul className="stage-two-options">
                <li className="stage-two-option">
                    <a className="stage-two-option-tag" onClick={() => {
                        iteration(1);
                    }}>
                        <img className="stage-two-option-img"></img>
                        <div className="stage-two-option-title">
                            {choiceOne}
                        </div>
                    </a>
                </li>
                <li className="stage-two-option">
                    <a className="stage-two-option-tag" onClick={() => {
                        iteration(2);
                    }}>
                        <img className="stage-two-option-img"></img>
                        <div className="stage-two-option-title">
                            {choiceTwo}
                        </div>
                    </a>
                </li>
            </ul>

        </div>
    )
}