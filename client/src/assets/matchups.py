

class Matchup:
    def __init__(self, first_title, second_title):
        self.left = first_title
        self.right = second_title
    def get_left(self):
        return self.left
    def get_right(self):
        return self.right

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

    def isEmpty(self):
        return len(self.matchups) == 0;

    def check_if_dupe(self, new_matchup):
        for matchup in self.matchups:
            if self.compare_matchups(matchup, new_matchup):
                return True
        return False
    
    def compare_matchups(self, first_matchup, second_matchup):
        if first_matchup.get_left() == second_matchup.get_left() and first_matchup.get_right() == second_matchup.get_right():
            return True
        if first_matchup.get_left() == second_matchup.get_right() and first_matchup.get_right() == second_matchup.get_left():
            return True
        else:
            return False