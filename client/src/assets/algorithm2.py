
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
        # only use belows, compare above with top of tree
        pass

    # takes as input three nodes in order of best to worst, specified by user
    def replace_edge(self, top, middle, bottom):
        pass


    def calculate_scores(self):
        # all songs that need a score update
        unchecked = set(self.songs.keys());

        while len(unchecked) > 0:
            song = list(unchecked)[0]
            

    



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

class Song:
    def __init__(self, title, songs_list):
        # song title used for lookup in dictionary
        self.title = title;
        # next node in doubly linked list
        self.above = [];
        self.below = [];
        # first node in linked list sequence above this node
        self.head = None;
        # set of songs not yet compared
        self.unknown = songs_list.copy();
        # integer representing +1 for every song below, 
        self.score = 0;
    
        self.unknown.remove(title);
    
    # getter methods
    def get_head(self):
        return self.head
    def get_below(self):
        return self.below
    def get_title(self):
        return self.title
    
    # setter methods
    def set_score(self, new_score):
        self.score = new_score;

    def add_edge(self, song_obj):
        if(self.below.isEmpty()):
            self.below.append(song_obj);

    def create_matchup(self):
        pass

class Matchups:
    def __init__(self):
        self.matchups = [];
    # returns and removes first matchup in line
    def dequeue(self):
        next_matchup = self.matchups[0]
        self.matchups.pop(0);
        return next_matchup;
    # pushes new matchup to the end of the queue
    def enqueue(self, matchup):
        if self.check_if_dupe(matchup) == False:
            self.matchups.append(matchup)

    def get_length(self):
        return len(self.matchups);

    def check_if_dupe(self, new_matchup):
        for matchup in self.matchups:
            if self.compare_matchups(matchup, new_matchup):
                return True
        return False
    
    def compare_matchups(self, first_matchup, second_matchup):
        if first_matchup.get_first() == second_matchup.get_first() and first_matchup.get_second() == second_matchup.get_second():
            return True
        if first_matchup.get_first() == second_matchup.get_second() and first_matchup.get_second() == second_matchup.get_first():
            return True
        else:
            return False

class Matchup:
    def __init__(self, first, second):
        self.first = first
        self.second = second
    def get_first(self):
        return self.first
    def get_second(self):
        return self.second