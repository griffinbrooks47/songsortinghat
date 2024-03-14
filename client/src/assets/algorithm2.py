
from matchups import Matchups, Matchup
from song import Song

class Algorithm:

    def __init__(self, songs_list):
        # queue for user question matchups
        self.matchups = Matchups()
        # maps song titles to song objects
        self.songs = {}
        for song in songs_list:
            self.songs[song] = Song(song, songs_list)

    def iteration(self):
        self.calculate_scores();
    
    # operates only on unlinked nodes, appends to current node tree
    def find_next_matchup(self):
        pass

    # finds nodes with two outgoing edges, creates matchup to fix tree
    def clean_tree(self):
        pass

    # creates an edge between two nodes
    def add_edge(self, top, bottom):
        pass

    # takes as input three nodes in order of best to worst, specified by user
    def replace_edge(self, top, middle, bottom):
        pass

    # traverses over all nodes recursively
    def update_scores(self):
        # all songs that need a score update
        for curr_song in self.songs.keys():
            checked = self.calculate_score_helper(curr_song, checked);

    def update_score_helper(self, curr_song):
        
        if(len(self.songs[curr_song].get_below()) == 0):
            self.songs[curr_song].set_score(0);
            return 0;
        else:
            score = len(self.songs[curr_song].get_below());
            for child in self.songs[curr_song].get_below():
                score += self.update_score_helper(child);
            return score;    

    def break_cycles(self):
        pass

    def check_if_finished(self):
        # set of all song titles not traversed
        unchecked = set(self.songs.keys())
        # list of all song title keys
        arb_song_title = list(self.songs.keys())[0]
        head = self.songs[arb_song_title].get_head()

        # traverses linked list of songs, determines if all songs are connected
        curr_node = head
        while(curr_node != None):
            if(len(curr_node) != 1):
                break;
            unchecked.remove(curr_node[0].get_title())
            curr_node = curr_node.get_below()

        # returns true if all songs are checked, false otherwise
        return len(unchecked) == 0;



