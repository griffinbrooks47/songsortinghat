import random


class Algorithm:
    def __init__(self, songs_list):
        self.songs = {}
        self.ranking = True

        self.skips = []
        self.prev_lowest = ''
        self.prev_highest = ''

        for song in songs_list:
            missing = [item for item in songs_list]
            missing.remove(song)
            self.songs[song] = {'above': [], 'below':[], 'score': 0, 'missing': missing, 'pass': False, 'rank': None}

    def find_lowest_score(self, exclude):
        songs_copy = self.songs.copy()

        if len(exclude) > 0:
            for song in exclude:
                songs_copy.pop(song)
            
        lowest_songs = list(songs_copy.keys())
        lowest_songs.sort(key=lambda x: self.songs[x]['score'], reverse=False)

        return lowest_songs[0]
    
    def find_highest_potential(self, excluded, lowest):

        # creates a deep copy of the song pool
        songs_copy = self.songs.copy()
        
        # finds the songs the lowest-score-song is looking for
        missing_songs = self.songs[lowest]['missing']

        # removes the excluded songs from the match pool

        for exclusion in excluded:
            if exclusion in missing_songs:
                missing_songs.remove(exclusion)

        missing_songs.sort(key=lambda x: self.songs[x]['score'], reverse=False) 

        if len(missing_songs) == 0:
            non_lowest = excluded.copy()
            non_lowest.remove(lowest)
            print('test case')


            
            for song, data in self.songs.items():
                print(song, data['above'], data['below'], len(data['missing']))

            return non_lowest[0]

        return missing_songs[0]
    

    def inherit(self, winner, loser):
        winner_above = self.songs[winner]['above']
        loser_below = self.songs[loser]['below']

        for song in winner_above:
            if song not in self.songs[loser]['above']:
                self.songs[loser]['above'].append(song)
                if song in self.songs[loser]['missing']:
                    self.songs[loser]['missing'].remove(song)

        for song in loser_below:
            if song not in self.songs[winner]['below']:
                self.songs[winner]['below'].append(song)
                if song in self.songs[winner]['missing']:
                    self.songs[winner]['missing'].remove(song)
        
        self.secondary_inherit(winner, loser)

    def secondary_inherit(self, winner, loser):
        for song in self.songs[winner]['above']:
            if loser not in self.songs[song]['below']:
                self.songs[song]['below'].append(loser)
                if loser in self.songs[song]['missing']: 
                    self.songs[song]['missing'].remove(loser)
            
            for loser_below in self.songs[loser]['below']:
                if loser_below not in self.songs[song]['below']:
                    self.songs[song]['below'].append(loser_below)
                    if loser_below in self.songs[song]['missing']:
                        self.songs[song]['missing'].remove(loser_below)

        for song in self.songs[loser]['below']:
            if winner not in self.songs[song]['above']:
                self.songs[song]['above'].append(winner)
                if winner in self.songs[song]['missing']:
                    self.songs[song]['missing'].remove(winner)
            for winner_above in self.songs[winner]['above']:
                if winner_above not in self.songs[song]['above']:
                    self.songs[song]['above'].append(winner_above) 
                    if winner_above in self.songs[song]['missing']:
                        self.songs[song]['missing'].remove(winner_above)

    def update_scores(self):
        for song, data in self.songs.items():

            score = len(data['above']) + len(data['below'])

            above = len(data['above'])
            below = -len(data['below'])
            match_score = above - below

            self.songs[song]['score'] = score
            self.songs[song]['match_score'] = match_score

            self.songs[song]['rank'] = 1+len(data['above'])
            self.songs[song]['pass'] = True if len(self.songs[song]['missing']) == 0 else False
        
        total_missing = 0
        for song, data in self.songs.items():
            total_missing += len(data['missing'])
        if total_missing == 0:
            self.ranking = False

    def iteration(self):

        # finds the song with the fewest number of compared songs
        lowest = self.find_lowest_score([])
        
        # ensures that find_highest_potential doesn't keep returning the same song
        self.skips = [lowest]

        for song, data in self.songs.items():
            if data['pass'] == True:
                self.skips.append(song)

        #if self.prev_highest in self.songs.keys():
        #    self.skips.append(self.prev_highest)

        # finds the song with the highest potential matches for the lowest
        # does not return a song contained in self.skips
        highest = self.find_highest_potential(self.skips, lowest)
            
        # asks the user which song is better
        print("Which is better: 1: " + lowest + " 2. " + highest)
        choice = input()
        if choice == '1':
            if highest not in self.songs[lowest]['below']:
                self.songs[lowest]['below'].append(highest)
                if highest in self.songs[lowest]['missing']:
                    self.songs[lowest]['missing'].remove(highest)
            if lowest not in self.songs[highest]['above']:
                self.songs[highest]['above'].append(lowest)
                if lowest in self.songs[highest]['missing']:
                    self.songs[highest]['missing'].remove(lowest)

            self.inherit(lowest, highest)

        else:
            if lowest not in self.songs[highest]['below']:
                self.songs[highest]['below'].append(lowest)
                if lowest in self.songs[highest]['missing']:
                    self.songs[highest]['missing'].remove(lowest)
            if highest not in self.songs[lowest]['above']:
                self.songs[lowest]['above'].append(highest)
                if highest in self.songs[lowest]['missing']:
                    self.songs[lowest]['missing'].remove(highest)

            self.inherit(highest, lowest)

        # updates all the metadata of each song in self.songs
        self.update_scores()

        

        # sets the previous songs for the next iteration
        self.prev_lowest = lowest
        self.prev_highest = highest

        # temporary
        for song, data in self.songs.items():
            print(song, data['above'], data['below'], len(data['missing']), data['pass'])
        

    def complete_rankings(self):
        final_rankings = {}
        for idx in range(len(self.songs)+1):
            for song, data in self.songs.items():
                if idx == data['rank']:
                    final_rankings[idx] = song
        
        print(final_rankings)
            


songs_list = ['No Problem', 'Good Ass Intro', 'Finish Line', 'Same Drugs', 'All We Got', 'NaNa', 'Blessings', 'Eternal', 'Sunday Candy', '14400 minutes', 'U got me fucked up', 'How Great', 'Juice', 'Cocoa Butter Kisses', 'Smoke Break', 'Prom Night']
random.shuffle(songs_list)

algorithm = Algorithm(songs_list)

while algorithm.ranking:
    algorithm.iteration()

print('FINAL')
algorithm.complete_rankings()

# MISSING SHOULD NOT BE MISSING 