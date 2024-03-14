

class Matchup:
    def __init__(self, first, second):
        self.first = first
        self.second = second
    def get_first(self):
        return self.first
    def get_second(self):
        return self.second

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