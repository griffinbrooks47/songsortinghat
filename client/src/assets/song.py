class Song:
    def __init__(self, title):
        
        # song title used for lookup in dictionary
        self.title = title;
        
        # next node in regular-order doubly linked list
        self.below = set();

        # next node in reverse-order doubly linked list
        self.above = set();

    def create_below_edge(self, song_node):

        if(song_node == self):
            pass;
        else:
            self.below.add(song_node);

    def create_above_edge(self, song_node):

        if(song_node == self):
            pass
        else:
            self.above.add(song_node);
    

    def check_below(self):
        return (len(self.below) > 1);

    def check_above(self):
        return (len(self.above) > 1);

    def get_below(self):
        return self.below
    
    def get_above(self):
        return self.above
    
    def get_title(self):
        return self.title



 