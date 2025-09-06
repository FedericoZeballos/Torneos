// Player Management System
class PlayerManager {
    constructor() {}

    // Create new player
    create(playerData) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can create players' };
        }

        // Validation
        if (!playerData.name) {
            return { success: false, message: 'Player name is required' };
        }

        const player = {
            name: playerData.name,
            age: parseInt(playerData.age) || null,
            position: playerData.position || '',
            jerseyNumber: parseInt(playerData.jerseyNumber) || null,
            teamId: playerData.teamId ? parseInt(playerData.teamId) : null,
            email: playerData.email || '',
            phone: playerData.phone || '',
            nationality: playerData.nationality || '',
            height: playerData.height || '',
            weight: playerData.weight || '',
            joinDate: playerData.joinDate || new Date().toISOString().split('T')[0]
        };

        // Validate jersey number uniqueness within team
        if (player.teamId && player.jerseyNumber) {
            const teamPlayers = db.filter('players', p => 
                p.teamId === player.teamId && p.jerseyNumber === player.jerseyNumber
            );
            if (teamPlayers.length > 0) {
                return { success: false, message: 'Jersey number already taken by another player in this team' };
            }
        }

        const createdPlayer = db.create('players', player);

        // Add player to team roster if teamId provided
        if (player.teamId) {
            const team = db.readById('teams', player.teamId);
            if (team) {
                if (!team.players.includes(createdPlayer.id)) {
                    team.players.push(createdPlayer.id);
                    db.update('teams', player.teamId, { players: team.players });
                }
            }
        }

        return { success: true, player: createdPlayer };
    }

    // Update player
    update(id, updates) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can update players' };
        }

        const player = db.readById('players', id);
        if (!player) {
            return { success: false, message: 'Player not found' };
        }

        // Validate jersey number uniqueness if being updated
        if (updates.jerseyNumber && updates.teamId) {
            const teamPlayers = db.filter('players', p => 
                p.teamId === parseInt(updates.teamId) && 
                p.jerseyNumber === parseInt(updates.jerseyNumber) &&
                p.id !== parseInt(id)
            );
            if (teamPlayers.length > 0) {
                return { success: false, message: 'Jersey number already taken by another player in this team' };
            }
        }

        // Handle team change
        if (updates.teamId !== undefined && updates.teamId !== player.teamId) {
            // Remove from old team
            if (player.teamId) {
                const oldTeam = db.readById('teams', player.teamId);
                if (oldTeam) {
                    const playerIndex = oldTeam.players.indexOf(parseInt(id));
                    if (playerIndex !== -1) {
                        oldTeam.players.splice(playerIndex, 1);
                        db.update('teams', player.teamId, { players: oldTeam.players });
                    }
                }
            }

            // Add to new team
            if (updates.teamId) {
                const newTeam = db.readById('teams', updates.teamId);
                if (newTeam) {
                    if (!newTeam.players.includes(parseInt(id))) {
                        newTeam.players.push(parseInt(id));
                        db.update('teams', updates.teamId, { players: newTeam.players });
                    }
                }
            }
        }

        const updatedPlayer = db.update('players', id, updates);
        if (updatedPlayer) {
            return { success: true, player: updatedPlayer };
        }
        return { success: false, message: 'Failed to update player' };
    }

    // Delete player
    delete(id) {
        if (!auth.isAdmin()) {
            return { success: false, message: 'Only administrators can delete players' };
        }

        const player = db.readById('players', id);
        if (!player) {
            return { success: false, message: 'Player not found' };
        }

        // Remove from team roster
        if (player.teamId) {
            const team = db.readById('teams', player.teamId);
            if (team) {
                const playerIndex = team.players.indexOf(parseInt(id));
                if (playerIndex !== -1) {
                    team.players.splice(playerIndex, 1);
                    db.update('teams', player.teamId, { players: team.players });
                }
            }
        }

        const success = db.delete('players', id);
        if (success) {
            return { success: true };
        }
        return { success: false, message: 'Failed to delete player' };
    }

    // Get all players
    getAll() {
        return db.readAll('players');
    }

    // Get player by ID
    getById(id) {
        return db.readById('players', id);
    }

    // Get players by team
    getByTeam(teamId) {
        return db.filter('players', player => player.teamId === parseInt(teamId));
    }

    // Get free agents (players without team)
    getFreeAgents() {
        return db.filter('players', player => !player.teamId);
    }

    // Search players
    search(query) {
        const players = this.getAll();
        const searchTerm = query.toLowerCase();
        
        return players.filter(player => 
            player.name.toLowerCase().includes(searchTerm) ||
            (player.position && player.position.toLowerCase().includes(searchTerm)) ||
            (player.nationality && player.nationality.toLowerCase().includes(searchTerm))
        );
    }

    // Get players with team information
    getAllWithTeamInfo() {
        const players = this.getAll();
        return players.map(player => {
            const teamInfo = player.teamId ? db.readById('teams', player.teamId) : null;
            return {
                ...player,
                teamName: teamInfo ? teamInfo.name : 'Free Agent'
            };
        });
    }

    // Get player statistics (placeholder for future expansion)
    getPlayerStats(playerId) {
        // This would typically calculate stats from match data
        // For now, return basic info
        const player = this.getById(playerId);
        if (!player) return null;

        const teamInfo = player.teamId ? db.readById('teams', player.teamId) : null;
        
        return {
            ...player,
            teamName: teamInfo ? teamInfo.name : 'Free Agent',
            matchesPlayed: 0, // TODO: Calculate from match data
            goals: 0, // TODO: Calculate from match data
            assists: 0 // TODO: Calculate from match data
        };
    }
}

// Global player manager instance
const playerManager = new PlayerManager();