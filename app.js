// Main Application Controller
class App {
    constructor() {
        this.currentView = 'tournaments';
        this.init();
    }

    init() {
        this.initEventListeners();
        this.updateUI();
        this.loadDefaultView();
    }

    initEventListeners() {
        // Authentication events
        document.getElementById('loginBtn').addEventListener('click', () => this.showModal('loginModal'));
        document.getElementById('registerBtn').addEventListener('click', () => this.showModal('registerModal'));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Close modal events
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.hideModal(modal.id);
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.hideModal(modal.id);
            });
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Add button events
        document.getElementById('addTournamentBtn').addEventListener('click', () => this.showTournamentForm());
        document.getElementById('addTeamBtn').addEventListener('click', () => this.showTeamForm());
        document.getElementById('addPlayerBtn').addEventListener('click', () => this.showPlayerForm());
        document.getElementById('addMatchBtn').addEventListener('click', () => this.showMatchForm());
    }

    // Authentication methods
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const result = auth.login(username, password);
        
        if (result.success) {
            this.hideModal('loginModal');
            this.updateUI();
            this.loadCurrentView();
            this.showAlert('Login successful!', 'success');
        } else {
            this.showAlert(result.message, 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const role = document.getElementById('registerRole').value;

        const result = auth.register(username, password, confirmPassword, role);
        
        if (result.success) {
            this.hideModal('registerModal');
            this.showAlert(result.message, 'success');
            document.getElementById('registerForm').reset();
        } else {
            this.showAlert(result.message, 'error');
        }
    }

    logout() {
        auth.logout();
        this.updateUI();
        this.loadCurrentView();
        this.showAlert('Logged out successfully!', 'info');
    }

    // UI Management
    updateUI() {
        const isLoggedIn = auth.isLoggedIn();
        const isAdmin = auth.isAdmin();
        const user = auth.getCurrentUser();

        // Update navigation
        document.getElementById('loginBtn').classList.toggle('hidden', isLoggedIn);
        document.getElementById('registerBtn').classList.toggle('hidden', isLoggedIn);
        document.getElementById('logoutBtn').classList.toggle('hidden', !isLoggedIn);
        document.getElementById('userInfo').classList.toggle('hidden', !isLoggedIn);

        if (isLoggedIn) {
            document.getElementById('userInfo').textContent = `Welcome, ${user.username} (${user.role})`;
        }

        // Show/hide admin controls
        document.querySelectorAll('.admin-only').forEach(element => {
            element.classList.toggle('hidden', !isAdmin);
        });
    }

    switchTab(tabName) {
        this.currentView = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });

        this.loadCurrentView();
    }

    loadDefaultView() {
        this.loadTournaments();
    }

    loadCurrentView() {
        switch(this.currentView) {
            case 'tournaments':
                this.loadTournaments();
                break;
            case 'teams':
                this.loadTeams();
                break;
            case 'players':
                this.loadPlayers();
                break;
            case 'matches':
                this.loadMatches();
                break;
        }
    }

    // Tournament views
    loadTournaments() {
        const tournaments = tournamentManager.getAll();
        const container = document.getElementById('tournamentsList');
        
        if (tournaments.length === 0) {
            container.innerHTML = '<p class="text-muted">No tournaments found.</p>';
            return;
        }

        container.innerHTML = tournaments.map(tournament => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${tournament.name}</div>
                        <div class="item-meta">
                            Format: ${tournament.format} | Status: 
                            <span class="status status-${tournament.status}">${tournament.status}</span>
                        </div>
                        <div class="item-meta">
                            Start: ${tournament.startDate || 'TBD'} | Teams: ${tournament.registeredTeams.length}/${tournament.maxTeams}
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-small" onclick="app.viewTournament(${tournament.id})">View</button>
                        ${auth.isAdmin() ? `
                            <button class="btn btn-small btn-secondary" onclick="app.showTournamentForm(${tournament.id})">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="app.deleteTournament(${tournament.id})">Delete</button>
                        ` : ''}
                    </div>
                </div>
                ${tournament.description ? `<div class="item-description">${tournament.description}</div>` : ''}
            </div>
        `).join('');
    }

    viewTournament(id) {
        const tournament = tournamentManager.getById(id);
        if (!tournament) return;

        const matches = matchManager.getByTournament(id);
        const standings = tournamentManager.getStandings(id);
        
        const teamsInfo = tournament.registeredTeams.map(teamId => {
            const team = db.readById('teams', teamId);
            return team ? team : { id: teamId, name: 'Unknown Team' };
        });

        const detailsPanel = document.getElementById('tournamentDetails');
        detailsPanel.classList.remove('hidden');
        
        detailsPanel.innerHTML = `
            <div class="details-header">
                <h3 class="details-title">${tournament.name}</h3>
                <div>
                    ${auth.isAdmin() ? `
                        <button class="btn btn-small btn-secondary" onclick="app.generateBracket(${id})">Generate Bracket</button>
                        <button class="btn btn-small" onclick="app.showTeamRegistration(${id})">Manage Teams</button>
                    ` : ''}
                    <button class="btn btn-small" onclick="app.hideTournamentDetails()">Close</button>
                </div>
            </div>
            
            <div class="details-section">
                <h4>Information</h4>
                <p><strong>Format:</strong> ${tournament.format}</p>
                <p><strong>Status:</strong> <span class="status status-${tournament.status}">${tournament.status}</span></p>
                <p><strong>Start Date:</strong> ${tournament.startDate || 'TBD'}</p>
                <p><strong>End Date:</strong> ${tournament.endDate || 'TBD'}</p>
                ${tournament.description ? `<p><strong>Description:</strong> ${tournament.description}</p>` : ''}
                ${tournament.rules ? `<p><strong>Rules:</strong> ${tournament.rules}</p>` : ''}
            </div>

            <div class="details-section">
                <h4>Registered Teams (${teamsInfo.length}/${tournament.maxTeams})</h4>
                ${teamsInfo.length > 0 ? `
                    <div class="teams-grid">
                        ${teamsInfo.map(team => `<div class="team-card">${team.name}</div>`).join('')}
                    </div>
                ` : '<p>No teams registered yet.</p>'}
            </div>

            ${standings.length > 0 ? `
                <div class="details-section">
                    <h4>${tournament.format === 'league' ? 'Standings' : 'Tournament Progress'}</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                ${tournament.format === 'league' ? `
                                    <th>Position</th>
                                    <th>Team</th>
                                    <th>Played</th>
                                    <th>Won</th>
                                    <th>Drawn</th>
                                    <th>Lost</th>
                                    <th>GF</th>
                                    <th>GA</th>
                                    <th>GD</th>
                                    <th>Points</th>
                                ` : `
                                    <th>Team</th>
                                    <th>Status</th>
                                    <th>Current Round</th>
                                `}
                            </tr>
                        </thead>
                        <tbody>
                            ${standings.map((standing, index) => `
                                <tr>
                                    ${tournament.format === 'league' ? `
                                        <td>${index + 1}</td>
                                        <td>${standing.teamName}</td>
                                        <td>${standing.played}</td>
                                        <td>${standing.won}</td>
                                        <td>${standing.drawn}</td>
                                        <td>${standing.lost}</td>
                                        <td>${standing.goalsFor}</td>
                                        <td>${standing.goalsAgainst}</td>
                                        <td>${standing.goalDifference}</td>
                                        <td><strong>${standing.points}</strong></td>
                                    ` : `
                                        <td>${standing.teamName}</td>
                                        <td><span class="status ${standing.isEliminated ? 'status-eliminated' : 'status-active'}">${standing.status}</span></td>
                                        <td>${standing.currentRound || 'Not started'}</td>
                                    `}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}

            ${matches.length > 0 ? `
                <div class="details-section">
                    <h4>Matches</h4>
                    <div class="matches-list">
                        ${matches.map(match => {
                            const team1 = db.readById('teams', match.team1Id);
                            const team2 = db.readById('teams', match.team2Id);
                            return `
                                <div class="match-card">
                                    <div class="match-teams">
                                        ${team1 ? team1.name : 'TBD'} vs ${team2 ? team2.name : 'TBD'}
                                    </div>
                                    <div class="match-details">
                                        ${match.status === 'completed' ? 
                                            `Score: ${match.team1Score} - ${match.team2Score}` :
                                            `Status: ${match.status}`
                                        }
                                        ${match.scheduledDate ? ` | Date: ${match.scheduledDate}` : ''}
                                        ${auth.isAdmin() && match.status === 'scheduled' ? `
                                            <button class="btn btn-small" onclick="app.showMatchResult(${match.id})">Record Result</button>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    hideTournamentDetails() {
        document.getElementById('tournamentDetails').classList.add('hidden');
    }

    generateBracket(tournamentId) {
        const result = tournamentManager.generateBracket(tournamentId);
        if (result.success) {
            this.showAlert(result.message, 'success');
            this.viewTournament(tournamentId);
        } else {
            this.showAlert(result.message, 'error');
        }
    }

    // Team views
    loadTeams() {
        const teams = teamManager.getAllWithStats();
        const container = document.getElementById('teamsList');
        
        if (teams.length === 0) {
            container.innerHTML = '<p class="text-muted">No teams found.</p>';
            return;
        }

        container.innerHTML = teams.map(team => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${team.name}</div>
                        <div class="item-meta">Players: ${team.playerCount}</div>
                        ${team.coach ? `<div class="item-meta">Coach: ${team.coach}</div>` : ''}
                    </div>
                    <div class="item-actions">
                        ${auth.isAdmin() ? `
                            <button class="btn btn-small btn-secondary" onclick="app.showTeamForm(${team.id})">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="app.deleteTeam(${team.id})">Delete</button>
                        ` : ''}
                    </div>
                </div>
                ${team.description ? `<div class="item-description">${team.description}</div>` : ''}
            </div>
        `).join('');
    }

    // Player views
    loadPlayers() {
        const players = playerManager.getAllWithTeamInfo();
        const container = document.getElementById('playersList');
        
        if (players.length === 0) {
            container.innerHTML = '<p class="text-muted">No players found.</p>';
            return;
        }

        container.innerHTML = players.map(player => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${player.name}</div>
                        <div class="item-meta">
                            ${player.position ? `Position: ${player.position} | ` : ''}
                            ${player.age ? `Age: ${player.age} | ` : ''}
                            Team: ${player.teamName}
                        </div>
                        ${player.jerseyNumber ? `<div class="item-meta">Jersey: #${player.jerseyNumber}</div>` : ''}
                    </div>
                    <div class="item-actions">
                        ${auth.isAdmin() ? `
                            <button class="btn btn-small btn-secondary" onclick="app.showPlayerForm(${player.id})">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="app.deletePlayer(${player.id})">Delete</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Match views
    loadMatches() {
        const matches = matchManager.getAllWithTeamInfo();
        const container = document.getElementById('matchesList');
        
        if (matches.length === 0) {
            container.innerHTML = '<p class="text-muted">No matches found.</p>';
            return;
        }

        container.innerHTML = matches.map(match => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${match.team1Name} vs ${match.team2Name}</div>
                        <div class="item-meta">
                            Tournament: ${match.tournamentName} | 
                            Status: <span class="status status-${match.status}">${match.status}</span>
                        </div>
                        ${match.scheduledDate ? `<div class="item-meta">Date: ${match.scheduledDate}</div>` : ''}
                        ${match.status === 'completed' ? `<div class="item-meta">Score: ${match.team1Score} - ${match.team2Score}</div>` : ''}
                    </div>
                    <div class="item-actions">
                        ${auth.isAdmin() ? `
                            ${match.status === 'scheduled' ? 
                                `<button class="btn btn-small" onclick="app.showMatchResult(${match.id})">Record Result</button>` : ''
                            }
                            <button class="btn btn-small btn-secondary" onclick="app.showMatchForm(${match.id})">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="app.deleteMatch(${match.id})">Delete</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Form handling methods (continued in next part due to length)
    showTournamentForm(id = null) {
        const tournament = id ? tournamentManager.getById(id) : null;
        const isEdit = !!tournament;

        const formHTML = `
            <h2>${isEdit ? 'Edit' : 'Add'} Tournament</h2>
            <form id="tournamentForm">
                <div class="form-group">
                    <label for="tournamentName">Name *</label>
                    <input type="text" id="tournamentName" value="${tournament ? tournament.name : ''}" required>
                </div>
                <div class="form-group">
                    <label for="tournamentDescription">Description</label>
                    <textarea id="tournamentDescription">${tournament ? tournament.description : ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="tournamentRules">Rules</label>
                    <textarea id="tournamentRules">${tournament ? tournament.rules : ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="tournamentStartDate">Start Date *</label>
                        <input type="date" id="tournamentStartDate" value="${tournament ? tournament.startDate : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="tournamentEndDate">End Date</label>
                        <input type="date" id="tournamentEndDate" value="${tournament ? tournament.endDate : ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="tournamentFormat">Format</label>
                        <select id="tournamentFormat">
                            <option value="knockout" ${tournament && tournament.format === 'knockout' ? 'selected' : ''}>Knockout</option>
                            <option value="league" ${tournament && tournament.format === 'league' ? 'selected' : ''}>League</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tournamentMaxTeams">Max Teams</label>
                        <input type="number" id="tournamentMaxTeams" value="${tournament ? tournament.maxTeams : 16}" min="2" max="64">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Tournament</button>
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">Cancel</button>
                </div>
            </form>
        `;

        document.getElementById('formContainer').innerHTML = formHTML;
        this.showModal('formModal');

        document.getElementById('tournamentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('tournamentName').value,
                description: document.getElementById('tournamentDescription').value,
                rules: document.getElementById('tournamentRules').value,
                startDate: document.getElementById('tournamentStartDate').value,
                endDate: document.getElementById('tournamentEndDate').value,
                format: document.getElementById('tournamentFormat').value,
                maxTeams: document.getElementById('tournamentMaxTeams').value
            };

            let result;
            if (isEdit) {
                result = tournamentManager.update(id, formData);
            } else {
                result = tournamentManager.create(formData);
            }

            if (result.success) {
                this.hideModal('formModal');
                this.loadTournaments();
                this.showAlert(`Tournament ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
            } else {
                this.showAlert(result.message, 'error');
            }
        });
    }

    showTeamForm(id = null) {
        const team = id ? teamManager.getById(id) : null;
        const isEdit = !!team;

        const formHTML = `
            <h2>${isEdit ? 'Edit' : 'Add'} Team</h2>
            <form id="teamForm">
                <div class="form-group">
                    <label for="teamName">Name *</label>
                    <input type="text" id="teamName" value="${team ? team.name : ''}" required>
                </div>
                <div class="form-group">
                    <label for="teamDescription">Description</label>
                    <textarea id="teamDescription">${team ? team.description : ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="teamCoach">Coach</label>
                        <input type="text" id="teamCoach" value="${team ? team.coach : ''}">
                    </div>
                    <div class="form-group">
                        <label for="teamFoundedDate">Founded Date</label>
                        <input type="date" id="teamFoundedDate" value="${team ? team.foundedDate : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="teamHomeVenue">Home Venue</label>
                    <input type="text" id="teamHomeVenue" value="${team ? team.homeVenue : ''}">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Team</button>
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">Cancel</button>
                </div>
            </form>
        `;

        document.getElementById('formContainer').innerHTML = formHTML;
        this.showModal('formModal');

        document.getElementById('teamForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('teamName').value,
                description: document.getElementById('teamDescription').value,
                coach: document.getElementById('teamCoach').value,
                foundedDate: document.getElementById('teamFoundedDate').value,
                homeVenue: document.getElementById('teamHomeVenue').value
            };

            let result;
            if (isEdit) {
                result = teamManager.update(id, formData);
            } else {
                result = teamManager.create(formData);
            }

            if (result.success) {
                this.hideModal('formModal');
                this.loadTeams();
                this.showAlert(`Team ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
            } else {
                this.showAlert(result.message, 'error');
            }
        });
    }

    showPlayerForm(id = null) {
        const player = id ? playerManager.getById(id) : null;
        const isEdit = !!player;
        const teams = teamManager.getAll();

        const formHTML = `
            <h2>${isEdit ? 'Edit' : 'Add'} Player</h2>
            <form id="playerForm">
                <div class="form-group">
                    <label for="playerName">Name *</label>
                    <input type="text" id="playerName" value="${player ? player.name : ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="playerAge">Age</label>
                        <input type="number" id="playerAge" value="${player ? player.age || '' : ''}" min="16" max="50">
                    </div>
                    <div class="form-group">
                        <label for="playerPosition">Position</label>
                        <input type="text" id="playerPosition" value="${player ? player.position : ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="playerJerseyNumber">Jersey Number</label>
                        <input type="number" id="playerJerseyNumber" value="${player ? player.jerseyNumber || '' : ''}" min="1" max="99">
                    </div>
                    <div class="form-group">
                        <label for="playerTeam">Team</label>
                        <select id="playerTeam">
                            <option value="">Free Agent</option>
                            ${teams.map(team => `
                                <option value="${team.id}" ${player && player.teamId === team.id ? 'selected' : ''}>
                                    ${team.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="playerEmail">Email</label>
                        <input type="email" id="playerEmail" value="${player ? player.email : ''}">
                    </div>
                    <div class="form-group">
                        <label for="playerPhone">Phone</label>
                        <input type="tel" id="playerPhone" value="${player ? player.phone : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="playerNationality">Nationality</label>
                    <input type="text" id="playerNationality" value="${player ? player.nationality : ''}">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Player</button>
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">Cancel</button>
                </div>
            </form>
        `;

        document.getElementById('formContainer').innerHTML = formHTML;
        this.showModal('formModal');

        document.getElementById('playerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('playerName').value,
                age: document.getElementById('playerAge').value,
                position: document.getElementById('playerPosition').value,
                jerseyNumber: document.getElementById('playerJerseyNumber').value,
                teamId: document.getElementById('playerTeam').value || null,
                email: document.getElementById('playerEmail').value,
                phone: document.getElementById('playerPhone').value,
                nationality: document.getElementById('playerNationality').value
            };

            let result;
            if (isEdit) {
                result = playerManager.update(id, formData);
            } else {
                result = playerManager.create(formData);
            }

            if (result.success) {
                this.hideModal('formModal');
                this.loadPlayers();
                this.showAlert(`Player ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
            } else {
                this.showAlert(result.message, 'error');
            }
        });
    }

    showMatchForm(id = null) {
        const match = id ? matchManager.getById(id) : null;
        const isEdit = !!match;
        const tournaments = tournamentManager.getAll();
        const teams = teamManager.getAll();

        const formHTML = `
            <h2>${isEdit ? 'Edit' : 'Add'} Match</h2>
            <form id="matchForm">
                <div class="form-group">
                    <label for="matchTournament">Tournament *</label>
                    <select id="matchTournament" required>
                        <option value="">Select Tournament</option>
                        ${tournaments.map(tournament => `
                            <option value="${tournament.id}" ${match && match.tournamentId === tournament.id ? 'selected' : ''}>
                                ${tournament.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="matchTeam1">Team 1 *</label>
                        <select id="matchTeam1" required>
                            <option value="">Select Team 1</option>
                            ${teams.map(team => `
                                <option value="${team.id}" ${match && match.team1Id === team.id ? 'selected' : ''}>
                                    ${team.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="matchTeam2">Team 2 *</label>
                        <select id="matchTeam2" required>
                            <option value="">Select Team 2</option>
                            ${teams.map(team => `
                                <option value="${team.id}" ${match && match.team2Id === team.id ? 'selected' : ''}>
                                    ${team.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="matchDate">Date</label>
                        <input type="date" id="matchDate" value="${match ? match.scheduledDate || '' : ''}">
                    </div>
                    <div class="form-group">
                        <label for="matchTime">Time</label>
                        <input type="time" id="matchTime" value="${match ? match.scheduledTime || '' : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="matchVenue">Venue</label>
                    <input type="text" id="matchVenue" value="${match ? match.venue : ''}">
                </div>
                <div class="form-group">
                    <label for="matchRound">Round</label>
                    <input type="number" id="matchRound" value="${match ? match.round : 1}" min="1">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Match</button>
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">Cancel</button>
                </div>
            </form>
        `;

        document.getElementById('formContainer').innerHTML = formHTML;
        this.showModal('formModal');

        document.getElementById('matchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                tournamentId: document.getElementById('matchTournament').value,
                team1Id: document.getElementById('matchTeam1').value,
                team2Id: document.getElementById('matchTeam2').value,
                scheduledDate: document.getElementById('matchDate').value,
                scheduledTime: document.getElementById('matchTime').value,
                venue: document.getElementById('matchVenue').value,
                round: document.getElementById('matchRound').value
            };

            let result;
            if (isEdit) {
                result = matchManager.update(id, formData);
            } else {
                result = matchManager.create(formData);
            }

            if (result.success) {
                this.hideModal('formModal');
                this.loadMatches();
                this.showAlert(`Match ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
            } else {
                this.showAlert(result.message, 'error');
            }
        });
    }

    showMatchResult(matchId) {
        const match = matchManager.getById(matchId);
        if (!match) return;

        const team1 = db.readById('teams', match.team1Id);
        const team2 = db.readById('teams', match.team2Id);

        const formHTML = `
            <h2>Record Match Result</h2>
            <form id="resultForm">
                <div class="match-info">
                    <h3>${team1 ? team1.name : 'TBD'} vs ${team2 ? team2.name : 'TBD'}</h3>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="team1Score">${team1 ? team1.name : 'Team 1'} Score</label>
                        <input type="number" id="team1Score" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="team2Score">${team2 ? team2.name : 'Team 2'} Score</label>
                        <input type="number" id="team2Score" min="0" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="matchNotes">Notes</label>
                    <textarea id="matchNotes" placeholder="Optional match notes..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Record Result</button>
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">Cancel</button>
                </div>
            </form>
        `;

        document.getElementById('formContainer').innerHTML = formHTML;
        this.showModal('formModal');

        document.getElementById('resultForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const team1Score = document.getElementById('team1Score').value;
            const team2Score = document.getElementById('team2Score').value;
            const notes = document.getElementById('matchNotes').value;

            const result = matchManager.recordResult(matchId, team1Score, team2Score, notes);

            if (result.success) {
                this.hideModal('formModal');
                this.loadMatches();
                this.showAlert(result.message, 'success');
            } else {
                this.showAlert(result.message, 'error');
            }
        });
    }

    // Delete methods
    deleteTournament(id) {
        if (confirm('Are you sure you want to delete this tournament? This will also delete all related matches.')) {
            const result = tournamentManager.delete(id);
            if (result.success) {
                this.loadTournaments();
                this.showAlert('Tournament deleted successfully!', 'success');
            } else {
                this.showAlert(result.message, 'error');
            }
        }
    }

    deleteTeam(id) {
        if (confirm('Are you sure you want to delete this team?')) {
            const result = teamManager.delete(id);
            if (result.success) {
                this.loadTeams();
                this.showAlert('Team deleted successfully!', 'success');
            } else {
                this.showAlert(result.message, 'error');
            }
        }
    }

    deletePlayer(id) {
        if (confirm('Are you sure you want to delete this player?')) {
            const result = playerManager.delete(id);
            if (result.success) {
                this.loadPlayers();
                this.showAlert('Player deleted successfully!', 'success');
            } else {
                this.showAlert(result.message, 'error');
            }
        }
    }

    deleteMatch(id) {
        if (confirm('Are you sure you want to delete this match?')) {
            const result = matchManager.delete(id);
            if (result.success) {
                this.loadMatches();
                this.showAlert('Match deleted successfully!', 'success');
            } else {
                this.showAlert(result.message, 'error');
            }
        }
    }

    // Utility methods
    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.main .container');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});