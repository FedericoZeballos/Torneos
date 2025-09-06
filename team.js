// Team Management System
class TeamManager {
    constructor() {}

    // Create new team
    create(teamData) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can create teams' };
        }

        // Validation
        if (!teamData.name) {
            return { success: false, message: 'Team name is required' };
        }

        const team = {
            name: teamData.name,
            logo: teamData.logo || '',
            description: teamData.description || '',
            players: teamData.players || [],
            foundedDate: teamData.foundedDate || '',
            coach: teamData.coach || '',
            homeVenue: teamData.homeVenue || ''
        };

        const createdTeam = db.create('teams', team);
        return { success: true, team: createdTeam };
    }

    // Update team
    update(id, updates) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can update teams' };
        }

        const updatedTeam = db.update('teams', id, updates);
        if (updatedTeam) {
            return { success: true, team: updatedTeam };
        }
        return { success: false, message: 'Team not found' };
    }

    // Delete team
    delete(id) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can delete teams' };
        }

        // Check if team is registered in any tournament
        const tournaments = db.readAll('tournaments');
        const isRegistered = tournaments.some(tournament => 
            tournament.registeredTeams && tournament.registeredTeams.includes(parseInt(id))
        );

        if (isRegistered) {
            return { success: false, message: 'Cannot delete team that is registered in tournaments' };
        }

        // Update players to remove team reference
        const players = db.filter('players', player => player.teamId === parseInt(id));
        players.forEach(player => {
            db.update('players', player.id, { teamId: null });
        });

        const success = db.delete('teams', id);
        if (success) {
            return { success: true };
        }
        return { success: false, message: 'Team not found' };
    }

    // Get all teams
    getAll() {
        return db.readAll('teams');
    }

    // Get team by ID
    getById(id) {
        return db.readById('teams', id);
    }

    // Add player to team
    addPlayer(teamId, playerId) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can manage team rosters' };
        }

        const team = this.getById(teamId);
        const player = db.readById('players', playerId);

        if (!team || !player) {
            return { success: false, message: 'Team or player not found' };
        }

        if (player.teamId && player.teamId !== parseInt(teamId)) {
            return { success: false, message: 'Player is already assigned to another team' };
        }

        // Update player's team
        db.update('players', playerId, { teamId: parseInt(teamId) });

        // Add player to team's roster if not already there
        if (!team.players.includes(parseInt(playerId))) {
            team.players.push(parseInt(playerId));
            this.update(teamId, { players: team.players });
        }

        return { success: true, message: 'Player added to team successfully' };
    }

    // Remove player from team
    removePlayer(teamId, playerId) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can manage team rosters' };
        }

        const team = this.getById(teamId);
        if (!team) {
            return { success: false, message: 'Team not found' };
        }

        // Remove player from team's roster
        const playerIndex = team.players.indexOf(parseInt(playerId));
        if (playerIndex !== -1) {
            team.players.splice(playerIndex, 1);
            this.update(teamId, { players: team.players });
        }

        // Update player to remove team reference
        db.update('players', playerId, { teamId: null });

        return { success: true, message: 'Player removed from team successfully' };
    }

    // Get team players
    getPlayers(teamId) {
        const team = this.getById(teamId);
        if (!team) return [];

        return team.players.map(playerId => db.readById('players', playerId)).filter(player => player);
    }

    // Get teams with player count
    getAllWithStats() {
        const teams = this.getAll();
        return teams.map(team => ({
            ...team,
            playerCount: team.players.length,
            players: team.players.map(playerId => db.readById('players', playerId)).filter(player => player)
        }));
    }
}

// Global team manager instance
const teamManager = new TeamManager();