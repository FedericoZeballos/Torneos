// Tournament Management System
class TournamentManager {
    constructor() {
        this.currentTournament = null;
    }

    // Create new tournament
    create(tournamentData) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can create tournaments' };
        }

        // Validation
        if (!tournamentData.name || !tournamentData.startDate) {
            return { success: false, message: 'Tournament name and start date are required' };
        }

        const tournament = {
            name: tournamentData.name,
            description: tournamentData.description || '',
            rules: tournamentData.rules || '',
            startDate: tournamentData.startDate,
            endDate: tournamentData.endDate || '',
            format: tournamentData.format || 'knockout',
            status: 'upcoming',
            maxTeams: parseInt(tournamentData.maxTeams) || 16,
            registeredTeams: [],
            bracket: null,
            standings: []
        };

        const createdTournament = db.create('tournaments', tournament);
        return { success: true, tournament: createdTournament };
    }

    // Update tournament
    update(id, updates) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can update tournaments' };
        }

        const updatedTournament = db.update('tournaments', id, updates);
        if (updatedTournament) {
            return { success: true, tournament: updatedTournament };
        }
        return { success: false, message: 'Tournament not found' };
    }

    // Delete tournament
    delete(id) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can delete tournaments' };
        }

        const success = db.delete('tournaments', id);
        if (success) {
            // Also delete related matches
            const matches = db.filter('matches', match => match.tournamentId === parseInt(id));
            matches.forEach(match => db.delete('matches', match.id));
            return { success: true };
        }
        return { success: false, message: 'Tournament not found' };
    }

    // Get all tournaments
    getAll() {
        return db.readAll('tournaments');
    }

    // Get tournament by ID
    getById(id) {
        return db.readById('tournaments', id);
    }

    // Register team to tournament
    registerTeam(tournamentId, teamId) {
        const tournament = this.getById(tournamentId);
        const team = db.readById('teams', teamId);

        if (!tournament || !team) {
            return { success: false, message: 'Tournament or team not found' };
        }

        if (tournament.registeredTeams.includes(teamId)) {
            return { success: false, message: 'Team is already registered' };
        }

        if (tournament.registeredTeams.length >= tournament.maxTeams) {
            return { success: false, message: 'Tournament is full' };
        }

        tournament.registeredTeams.push(teamId);
        this.update(tournamentId, { registeredTeams: tournament.registeredTeams });

        return { success: true, message: 'Team registered successfully' };
    }

    // Unregister team from tournament
    unregisterTeam(tournamentId, teamId) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can unregister teams' };
        }

        const tournament = this.getById(tournamentId);
        if (!tournament) {
            return { success: false, message: 'Tournament not found' };
        }

        const index = tournament.registeredTeams.indexOf(teamId);
        if (index === -1) {
            return { success: false, message: 'Team is not registered' };
        }

        tournament.registeredTeams.splice(index, 1);
        this.update(tournamentId, { registeredTeams: tournament.registeredTeams });

        return { success: true, message: 'Team unregistered successfully' };
    }

    // Generate tournament bracket/fixtures
    generateBracket(tournamentId) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can generate brackets' };
        }

        const tournament = this.getById(tournamentId);
        if (!tournament) {
            return { success: false, message: 'Tournament not found' };
        }

        const teams = tournament.registeredTeams;
        if (teams.length < 2) {
            return { success: false, message: 'At least 2 teams are required to generate bracket' };
        }

        let bracket = [];
        let matches = [];

        if (tournament.format === 'knockout') {
            bracket = this.generateKnockoutBracket(teams, tournamentId);
            matches = bracket.rounds[0]; // First round matches
        } else if (tournament.format === 'league') {
            matches = this.generateLeagueMatches(teams, tournamentId);
        }

        // Save matches to database
        matches.forEach(match => {
            db.create('matches', match);
        });

        // Update tournament with bracket and status
        this.update(tournamentId, { 
            bracket: bracket,
            status: 'active'
        });

        return { success: true, message: 'Bracket generated successfully' };
    }

    // Generate knockout bracket
    generateKnockoutBracket(teams, tournamentId) {
        const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
        const rounds = [];
        let currentRound = [];

        // First round
        for (let i = 0; i < shuffledTeams.length; i += 2) {
            if (i + 1 < shuffledTeams.length) {
                currentRound.push({
                    tournamentId: tournamentId,
                    team1Id: shuffledTeams[i],
                    team2Id: shuffledTeams[i + 1],
                    round: 1,
                    status: 'scheduled',
                    scheduledDate: null,
                    team1Score: null,
                    team2Score: null,
                    winnerId: null
                });
            }
        }

        rounds.push(currentRound);

        // Generate subsequent rounds (empty for now)
        let teamsInRound = currentRound.length;
        let roundNumber = 2;
        
        while (teamsInRound > 1) {
            const nextRound = [];
            for (let i = 0; i < Math.floor(teamsInRound / 2); i++) {
                nextRound.push({
                    tournamentId: tournamentId,
                    team1Id: null, // To be filled when previous round completes
                    team2Id: null,
                    round: roundNumber,
                    status: 'pending',
                    scheduledDate: null,
                    team1Score: null,
                    team2Score: null,
                    winnerId: null
                });
            }
            rounds.push(nextRound);
            teamsInRound = nextRound.length;
            roundNumber++;
        }

        return { type: 'knockout', rounds: rounds };
    }

    // Generate league matches (round-robin)
    generateLeagueMatches(teams, tournamentId) {
        const matches = [];
        
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                matches.push({
                    tournamentId: tournamentId,
                    team1Id: teams[i],
                    team2Id: teams[j],
                    round: 1,
                    status: 'scheduled',
                    scheduledDate: null,
                    team1Score: null,
                    team2Score: null,
                    winnerId: null
                });
            }
        }

        return matches;
    }

    // Get tournament standings
    getStandings(tournamentId) {
        const tournament = this.getById(tournamentId);
        if (!tournament) return [];

        if (tournament.format === 'league') {
            return this.calculateLeagueStandings(tournamentId);
        } else {
            return this.getKnockoutProgress(tournamentId);
        }
    }

    // Calculate league standings
    calculateLeagueStandings(tournamentId) {
        const matches = db.filter('matches', match => 
            match.tournamentId === parseInt(tournamentId) && match.status === 'completed'
        );

        const tournament = this.getById(tournamentId);
        const standings = [];

        tournament.registeredTeams.forEach(teamId => {
            const team = db.readById('teams', teamId);
            const teamStats = {
                teamId: teamId,
                teamName: team ? team.name : 'Unknown Team',
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0
            };

            matches.forEach(match => {
                if (match.team1Id === teamId || match.team2Id === teamId) {
                    teamStats.played++;
                    
                    const isTeam1 = match.team1Id === teamId;
                    const teamScore = isTeam1 ? match.team1Score : match.team2Score;
                    const opponentScore = isTeam1 ? match.team2Score : match.team1Score;

                    teamStats.goalsFor += teamScore;
                    teamStats.goalsAgainst += opponentScore;

                    if (teamScore > opponentScore) {
                        teamStats.won++;
                        teamStats.points += 3;
                    } else if (teamScore === opponentScore) {
                        teamStats.drawn++;
                        teamStats.points += 1;
                    } else {
                        teamStats.lost++;
                    }
                }
            });

            teamStats.goalDifference = teamStats.goalsFor - teamStats.goalsAgainst;
            standings.push(teamStats);
        });

        // Sort standings
        standings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
        });

        return standings;
    }

    // Get knockout tournament progress
    getKnockoutProgress(tournamentId) {
        const tournament = this.getById(tournamentId);
        if (!tournament || !tournament.bracket) return [];

        const progress = [];
        tournament.registeredTeams.forEach(teamId => {
            const team = db.readById('teams', teamId);
            const matches = db.filter('matches', match => 
                match.tournamentId === parseInt(tournamentId) && 
                (match.team1Id === teamId || match.team2Id === teamId)
            );

            let currentRound = 0;
            let isEliminated = false;

            matches.forEach(match => {
                if (match.status === 'completed') {
                    if (match.winnerId !== teamId) {
                        isEliminated = true;
                    } else {
                        currentRound = match.round;
                    }
                }
            });

            progress.push({
                teamId: teamId,
                teamName: team ? team.name : 'Unknown Team',
                currentRound: currentRound,
                isEliminated: isEliminated,
                status: isEliminated ? 'Eliminated' : (currentRound > 0 ? `Round ${currentRound}` : 'First Round')
            });
        });

        return progress;
    }
}

// Global tournament manager instance
const tournamentManager = new TournamentManager();