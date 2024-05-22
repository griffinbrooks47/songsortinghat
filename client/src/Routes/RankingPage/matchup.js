
class Matchup {
    constructor(firstTitle, secondTitle) {
        // Song choice on the left. 
        this.left = firstTitle;
        // Song choice on the right.
        this.right = secondTitle;
    }
    getLeft = () => {
        return this.left;
    };
    getRight = () => {
        return this.right;
    };
}