
class MatchupQueue {
    constructor(){
        this.matchups = new Array();
    }

    compareMatchups(first, second) {
        if(first.getLeft() == second.getLeft() && first.getRight() == second.getRight()){
            return true;
        }
        if(first.getLeft() == second.getRight() && first.getRight() == second.getLeft()){
            return true;
        }
        return false;
    }

    checkIfDupe = (newMatchup) => {
        for(let matchup of this.matchups){
            if(this.compareMatchups(matchup, newMatchup)){
                return true;
            }
        }
        return false;
    }

    // Returns the first matchup in the queue. 
    dequeue = () => {
        let nextMatchup = this.matchups[0];
        this.matchups.shift();
        return nextMatchup;
    }
    // Adds a new matchup to the end of the queue. 
    enqueue = (newMatchup) => {
        if(!this.checkIfDupe(newMatchup)){
            this.matchups.push(newMatchup);
        }
    }
    // Returns true if there are no matchups. 
    isEmpty = () => {
        return this.matchups.length == 0;
    }
    // Returns length of matchups array. 
    getLength = () => {
        return this.matchups.length;
    }
}