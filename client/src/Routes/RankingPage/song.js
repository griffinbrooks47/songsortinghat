
class Song {
    constructor(title) {
        // Song title used for lookup in hashtable. 
        this.title = title,

        // Linked references to child song nodes. 
        this.below = new Set()
    }

    // Create an edge to a new child song node. 
    create_below_edge = (song_node) => {

        if (song_node != this) {
            this.below.add(song_node);
        }

    };

    // Remove an edge between this node and an input node, if it exists.
    remove_edge = (song_node) => {
        this.below.delete(song_node);
    };

    // Return child nodes. 
    get_below = () => {
        return this.below;
    };

    // Return the title of this song node. 
    get_title = () => {
        return this.title;
    };

}