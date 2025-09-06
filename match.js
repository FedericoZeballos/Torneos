// Match Management System
class MatchManager {
    constructor() {}

    // Create new match
    create(matchData) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can create matches' };
        }

        // Validation
        if (!matchData.tournamentId || !matchData.team1Id || !matchData.team2Id) {
            return { success: false, message: 'Tournament and both teams are required' };
        }

        if (matchData.team1Id === matchData.team2Id) {
            return { success: false, message: 'A team cannot play against itself' };
        }

        const match = {
            tournamentId: parseInt(matchData.tournamentId),
            team1Id: parseInt(matchData.team1Id),
            team2Id: parseInt(matchData.team2Id),
            scheduledDate: matchData.scheduledDate || null,
            scheduledTime: matchData.scheduledTime || null,
            venue: matchData.venue || '',
            round: parseInt(matchData.round) || 1,
            status: 'scheduled',
            team1Score: null,
            team2Score: null,
            winnerId: null,
            notes: matchData.notes || ''
        };

        const createdMatch = db.create('matches', match);
        return { success: true, match: createdMatch };
    }

    // Update match
    update(id, updates) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can update matches' };
        }

        const match = db.readById('matches', id);
        if (!match) {
            return { success: false, message: 'Match not found' };
        }

        // Handle score updates and determine winner
        if (updates.team1Score !== undefined || updates.team2Score !== undefined) {
            const team1Score = updates.team1Score !== undefined ? parseInt(updates.team1Score) : match.team1Score;
            const team2Score = updates.team2Score !== undefined ? parseInt(updates.team2Score) : match.team2Score;

            if (team1Score !== null && team2Score !== null) {
                updates.status = 'completed';
                updates.team1Score = team1Score;
                updates.team2Score = team2Score;

                if (team1Score > team2Score) {
                    updates.winnerId = match.team1Id;
                } else if (team2Score > team1Score) {
                    updates.winnerId = match.team2Id;
                } else {
                    updates.winnerId = null; // Draw
                }

                // Update knockout bracket progression if applicable
                this.updateKnockoutProgression(match, updates.winnerId);
            }
        }

        const updatedMatch = db.update('matches', id, updates);
        if (updatedMatch) {
            return { success: true, match: updatedMatch };
        }
        return { success: false, message: 'Failed to update match' };
    }

    // Delete match
    delete(id) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can delete matches' };
        }

        const success = db.delete('matches', id);
        if (success) {
            return { success: true };
        }
        return { success: false, message: 'Match not found' };
    }

    // Get all matches
    getAll() {
        return db.readAll('matches');
    }

    // Get match by ID
    getById(id) {
        return db.readById('matches', id);
    }

    // Get matches by tournament
    getByTournament(tournamentId) {
        return db.filter('matches', match => match.tournamentId === parseInt(tournamentId));
    }

    // Get matches by team
    getByTeam(teamId) {
        return db.filter('matches', match => 
            match.team1Id === parseInt(teamId) || match.team2Id === parseInt(teamId)
        );
    }

    // Get matches by status
    getByStatus(status) {
        return db.filter('matches', match => match.status === status);
    }

    // Record match result
    recordResult(matchId, team1Score, team2Score, notes = '') {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can record match results' };
        }

        const match = this.getById(matchId);
        if (!match) {
            return { success: false, message: 'Match not found' };
        }

        if (match.status === 'completed') {
            return { success: false, message: 'Match result has already been recorded' };
        }

        const result = this.update(matchId, {
            team1Score: parseInt(team1Score),
            team2Score: parseInt(team2Score),
            notes: notes,
            status: 'completed'
        });

        if (result.success) {
            return { success: true, message: 'Match result recorded successfully', match: result.match };
        }

        return result;
    }

    // Update knockout tournament progression
    updateKnockoutProgression(completedMatch, winnerId) {
        const tournament = db.readById('tournaments', completedMatch.tournamentId);
        if (!tournament || !tournament.bracket || tournament.bracket.type !== 'knockout') {
            return;
        }

        const currentRound = completedMatch.round;
        const nextRound = currentRound + 1;

        // Find next round matches
        const nextRoundMatches = db.filter('matches', match => 
            match.tournamentId === completedMatch.tournamentId && 
            match.round === nextRound &&
            match.status === 'pending'
        );

        if (nextRoundMatches.length === 0) return;

        // Find which next round match this winner should advance to
        const roundMatches = db.filter('matches', match => 
            match.tournamentId === completedMatch.tournamentId && 
            match.round === currentRound
        );

        const matchIndex = roundMatches.findIndex(match => match.id === completedMatch.id);
        const nextMatchIndex = Math.floor(matchIndex / 2);

        if (nextMatchIndex < nextRoundMatches.length) {
            const nextMatch = nextRoundMatches[nextMatchIndex];
            const updates = {};

            // Determine if winner goes to team1 or team2 slot
            if (matchIndex % 2 === 0) {
                updates.team1Id = winnerId;
            } else {
                updates.team2Id = winnerId;
            }

            // If both teams are now set, change status to scheduled
            if ((nextMatch.team1Id || updates.team1Id) && (nextMatch.team2Id || updates.team2Id)) {
                updates.status = 'scheduled';
            }

            db.update('matches', nextMatch.id, updates);
        }
    }

    // Get matches with team information
    getAllWithTeamInfo() {
        const matches = this.getAll();
        return matches.map(match => {
            const team1 = db.readById('teams', match.team1Id);
            const team2 = db.readById('teams', match.team2Id);
            const tournament = db.readById('tournaments', match.tournamentId);

            return {
                ...match,
                team1Name: team1 ? team1.name : 'TBD',
                team2Name: team2 ? team2.name : 'TBD',
                tournamentName: tournament ? tournament.name : 'Unknown Tournament'
            };
        });
    }

    // Get upcoming matches
    getUpcoming(limit = 10) {
        const upcomingMatches = this.getByStatus('scheduled');
        
        // Sort by date/time if available
        upcomingMatches.sort((a, b) => {
            if (a.scheduledDate && b.scheduledDate) {
                return new Date(a.scheduledDate) - new Date(b.scheduledDate);
            }
            return a.id - b.id;
        });

        return upcomingMatches.slice(0, limit).map(match => {
            const team1 = db.readById('teams', match.team1Id);
            const team2 = db.readById('teams', match.team2Id);
            const tournament = db.readById('tournaments', match.tournamentId);

            return {
                ...match,
                team1Name: team1 ? team1.name : 'TBD',
                team2Name: team2 ? team2.name : 'TBD',
                tournamentName: tournament ? tournament.name : 'Unknown Tournament'
            };
        });
    }

    // Get recent results
    getRecentResults(limit = 10) {
        const completedMatches = this.getByStatus('completed');
        
        // Sort by most recent first
        completedMatches.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        return completedMatches.slice(0, limit).map(match => {
            const team1 = db.readById('teams', match.team1Id);
            const team2 = db.readById('teams', match.team2Id);
            const tournament = db.readById('tournaments', match.tournamentId);

            return {
                ...match,
                team1Name: team1 ? team1.name : 'TBD',
                team2Name: team2 ? team2.name : 'TBD',
                tournamentName: tournament ? tournament.name : 'Unknown Tournament'
            };
        });
    }

    // Get match statistics
    getMatchStats(matchId) {
        const match = this.getById(matchId);
        if (!match) return null;

        const team1 = db.readById('teams', match.team1Id);
        const team2 = db.readById('teams', match.team2Id);
        const tournament = db.readById('tournaments', match.tournamentId);

        // Calculate head-to-head record
        const h2hMatches = db.filter('matches', m => 
            ((m.team1Id === match.team1Id && m.team2Id === match.team2Id) ||
             (m.team1Id === match.team2Id && m.team2Id === match.team1Id)) &&
            m.status === 'completed' && m.id !== match.id
        );

        let team1Wins = 0, team2Wins = 0, draws = 0;
        
        h2hMatches.forEach(m => {
            if (m.winnerId === match.team1Id) team1Wins++;
            else if (m.winnerId === match.team2Id) team2Wins++;
            else draws++;
        });

        return {
            ...match,
            team1Name: team1 ? team1.name : 'TBD',
            team2Name: team2 ? team2.name : 'TBD',
            tournamentName: tournament ? tournament.name : 'Unknown Tournament',
            headToHead: {
                team1Wins,
                team2Wins,
                draws,
                totalMatches: h2hMatches.length
            }
        };
    }
}

// Global match manager instance
const matchManager = new MatchManager();