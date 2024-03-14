class Song:
    def __init__(self, title, songs_list):
        # song title used for lookup in dictionary
        self.title = title;
        # next node in doubly linked list
        self.above_main
        self.below = [];
        # first node in linked list sequence above this node
        self.head = None;
        # set of songs not yet compared
        self.unknown = songs_list.copy();
        # 0 - top of tree, +inf bottom of tree
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