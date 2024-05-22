
import math
from matchups import Matchups, Matchup
from song import Song

class Algorithm:

    def __init__(self, set_of_songs):

        # Queue for user question matchups.
        self.matchups = Matchups()

        # Songs not yet on the tree. 
        self.songs_set = set_of_songs

        # Indicates if tree is finalized. 
        self.complete = False;

        # Displayed song choices for current iteration
        self.curr_matchup = None;

        # maps song titles to song objects
        self.songs_map = {}
        for title in set_of_songs:
            self.songs_map[title] = Song(title)

        # maps title to score
        self.score_map = {}

        # maps scores to the set of titles with that score
        self.reverse_score_map = {}
        
        # Maps songs to songs its been ranked above directly
        self.choice_cache = {}

    def run_algorithm(self):

        # Initialize first matchup
        first_title = list(self.songs_set)[0]
        self.songs_set.discard(first_title)

        second_title = list(self.songs_set)[0]
        self.songs_set.discard(second_title)

        self.curr_matchup = Matchup(first_title, second_title)

        # Algorithm loop
        while not self.complete:

            left_title = self.curr_matchup.get_left()
            right_title = self.curr_matchup.get_right()

            print("1: " + left_title)
            print("2: " + right_title)
            user_choice = input("");

            # Handles user choice. 
            if(user_choice == "1"):
                self.handle_choice(left_title, right_title)
            elif(user_choice == "2"):
                self.handle_choice(right_title, left_title)
            else:
                continue;
    
            # Runs iteration.
            self.iteration();
            print("_________________")
            
        print(self.choice_cache)

    def handle_choice(self, winner_title, loser_title):
        
        # Grabs song nodes
        winner_song = self.songs_map[winner_title];
        loser_song = self.songs_map[loser_title];
    
        # Creates tree edge between winner and loser
        winner_song.create_below_edge(loser_song);
        loser_song.create_above_edge(winner_song);
        
        # Add to cache of user choices. 
        if winner_title not in self.choice_cache:
            self.choice_cache[winner_title] = set()
        self.choice_cache[winner_title].add(loser_title)
            
            

    # Iteration occurs after a choice has been made by the user
    def iteration(self):

        # Step 1: Score the entire tree, following each user choice. 
        self.score_tree();

        # Step 2: add new song to matchup pool and queue matchup
        self.gen_choice();
        
        # Step 3: scan tree, add matchups that fix first degree node branch splits
        self.resolve_branches();

        # Step 4: Set next matchup from matchups queue
        if(self.matchups.isEmpty()):
            # Indicates algorithm completion
            self.complete = True;
        else:
            while True:
                self.curr_matchup = self.matchups.dequeue()
                
                # Step 5: Ensures matchup is safe from cycles. 
                if self.check_safe_matchup(self.curr_matchup):
                    # Step 6: Automatically make choice if possible
                    if(self.check_if_answered(self.curr_matchup)):
                        pass
                    else:
                        break
                    
        
        #print(self.reverse_score_map)
        
    # Automatically resolve matchup if user previously compared the two songs. 
    def check_if_answered(self, matchup):
        
        left_title = matchup.get_left();
        right_title = matchup.get_right();
        
        if(left_title in self.choice_cache and right_title in self.choice_cache[left_title]):
            self.handle_choice(left_title, right_title)
            print("Automatic Answer")
            return True
        elif(right_title in self.choice_cache and left_title in self.choice_cache[right_title]):
            self.handle_choice(right_title, left_title)
            print("Automatic Answer")
            return True
        else:
            return False;
       
    # Safe guard to prevent choices that cause graph cycles. 
    def check_safe_matchup(self, matchup):

        left_title = matchup.get_left();
        right_title = matchup.get_right();

        # Allows matchup if it introduces a new node (cycle safe). 
        if(left_title not in self.score_map 
           or right_title not in self.score_map):
            return True;

        # Scores must match, otherwise discard matchup
        left_score = self.score_map[matchup.get_left()]
        right_score = self.score_map[matchup.get_right()]

        return (left_score == right_score)

        

    # Adds a new song to the tree via a new matchup. 
    def gen_choice(self):

        # Indicates all songs have been added to the tree. 
        if(len(self.songs_set) != 0):

            # Left song adds a new song to the tree. 
            left_song_title = list(self.songs_set)[0];
            # Right song is the best matchup candidate
            right_song_title = self.find_best_match();

            # Indicates that left_song is now in the tree. 
            self.songs_set.discard(left_song_title);

            if(len(self.songs_set) != 0):
                new_matchup = Matchup(left_song_title, right_song_title);
                self.matchups.enqueue(new_matchup);
    
    # Currently just sorts the new song in around the middle of tree. 
    def find_best_match(self):

        # Longest critical path
        score_map_len = len(self.reverse_score_map);

        # middle of tree
        middle_idx = math.floor(score_map_len / 2.0);
    
        return list(self.reverse_score_map[middle_idx])[0]

    # Scans the tree, adds matchups that fixes first degree diverging branches. 
    def resolve_branches(self):

        # Step 1: Fix edges that fall under transitive property - no matchups created
        #   Remove edges between neighboring nodes with a difference in degree > 1
        for title, parent_node in self.songs_map.items():

            if(title not in self.score_map):
                continue;
            
            parent_score = self.score_map[title]
            children = parent_node.get_below()

            edges_to_remove = set()

            for child_node in children:

                child_score = self.score_map[child_node.get_title()]

                if abs(parent_score - child_score) > 1:
                    edges_to_remove.add(child_node)

            for child in edges_to_remove:
                parent_node.remove_edge(child)
                #print("Edge Removed: " + title + " -> " + child.get_title())


        # Step 2: Create necessary matchups - songs of same score are candidates
        for score, title_set in self.reverse_score_map.items():

            title_set_len = len(title_set)

            if(title_set_len >= 2):

                title_list = list(title_set)
                # Rounds length down to nearest even num
                for i in range(0, title_set_len - title_set_len%2, 2):
                    
                    left_title = title_list[i]
                    right_title = title_list[i+1]
                    
                    #print("New Match: " + left_title + " vs " + right_title)
                    new_matchup = Matchup(left_title, right_title)
                    self.matchups.enqueue(new_matchup)
        

    # Recalculate scores for each node in the tree.
    def score_tree(self):
        
        # Clear scores map. 
        self.score_map.clear();
        self.reverse_score_map.clear();

        # Calculates below & above scores. 
        for title, curr_node in self.songs_map.items():

            if(title in self.songs_set):
                continue;

            # Returns values aren't needed. 
            dummy_one = self.score_tree_below(curr_node)


    # Recursive helper for score_tree() : Below direction
    def score_tree_below(self, node):
            
        children = node.get_below();
        title = node.get_title();

        # Indicates there are no children
        if(len(children) == 0):
            
            # Update score maps
            self.score_map[title] = 0
            self.add_to_reverse_score_map(0, title)

            return 0
        
        # Skips recursion if a score has already been calculated. 
        elif(title in self.score_map):
            return self.score_map[title]
        
        # Recursively calculate children scores to then find node score. 
        else:
    
            max_child_score = 0

            for child in children:

                curr_child_score = self.score_tree_below(child)

                if(curr_child_score > max_child_score):
                    max_child_score = curr_child_score

            # update score maps
            self.score_map[title] = max_child_score + 1
            self.add_to_reverse_score_map(max_child_score + 1, title)

            return max_child_score + 1
        
    def add_to_reverse_score_map(self, score, title):

        if(score in self.reverse_score_map):
            self.reverse_score_map[score].add(title)
        else:
            title_set = set()
            title_set.add(title)
            self.reverse_score_map[score] = title_set


algorithm = Algorithm({"She Wants To Move", "The Way She Dances", "Bobby James", "Spaz", "Tape You", "You Know What", "The Man", "Breakout", "Fly or Die", "Lap Dance", "Run to the sun", "Everyone Nose"});
algorithm.run_algorithm();


# To Add:
# Keep track of song losses and wins - make these affect the song placement
# Keep track of inheritance in the song choice cache