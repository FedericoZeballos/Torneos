// Main Application Controller
class App {
  constructor() {
    this.currentView = "tournaments";
    this.init();
  }

  init() {
    this.initEventListeners();
    this.updateUI();
    this.loadDefaultView();
  }

  initEventListeners() {
    // Authentication events
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        this.showModal("loginModal");
      });
    }

    if (registerBtn) {
      registerBtn.addEventListener("click", () => {
        this.showModal("registerModal");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }

    // Close modal events
    document.querySelectorAll(".close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        if (modal) this.hideModal(modal.id);
      });
    });

    // Click outside modal to close
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.hideModal(modal.id);
      });
    });

    // Form submissions
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        this.handleLogin(e);
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        this.handleRegister(e);
      });
    }

    // Tab navigation
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.switchTab(btn.dataset.tab));
    });

    // Add button events
    const addTournamentBtn = document.getElementById("addTournamentBtn");
    const addTeamBtn = document.getElementById("addTeamBtn");
    const addPlayerBtn = document.getElementById("addPlayerBtn");
    const addMatchBtn = document.getElementById("addMatchBtn");

    if (addTournamentBtn) {
      addTournamentBtn.addEventListener("click", () =>
        this.showTournamentForm()
      );
    }
    if (addTeamBtn) {
      addTeamBtn.addEventListener("click", () => this.showTeamForm());
    }
    if (addPlayerBtn) {
      addPlayerBtn.addEventListener("click", () => this.showPlayerForm());
    }
    if (addMatchBtn) {
      addMatchBtn.addEventListener("click", () => this.showMatchForm());
    }
  }

  // Authentication methods
  handleLogin(e) {
    e.preventDefault();

    // Obtener valores y limpiar espacios
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    // Validaciones de frontend
    if (!username || !password) {
      this.showAlert("Por favor, complete todos los campos", "error");
      return;
    }

    // Mostrar estado de carga
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Iniciando sesión...";
    submitBtn.disabled = true;

    try {
      const result = auth.login(username, password);

      if (result.success) {
        this.hideModal("loginModal");
        this.updateUI();
        this.loadCurrentView();
        this.showAlert(
          "¡Bienvenido de nuevo! Sesión iniciada exitosamente",
          "success"
        );
        // Limpiar formulario
        document.getElementById("loginForm").reset();
      } else {
        this.showAlert(result.message, "error");
      }
    } catch (error) {
      this.showAlert("Error inesperado al iniciar sesión", "error");
    } finally {
      // Restaurar botón
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  handleRegister(e) {
    e.preventDefault();

    // Obtener valores y limpiar espacios
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById(
      "registerConfirmPassword"
    ).value;
    const role = document.getElementById("registerRole").value;

    // Validaciones de frontend
    if (!username || !password || !confirmPassword) {
      this.showAlert("Por favor, complete todos los campos", "error");
      return;
    }

    if (password !== confirmPassword) {
      this.showAlert("Las contraseñas no coinciden", "error");
      return;
    }

    // Mostrar estado de carga
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Registrando...";
    submitBtn.disabled = true;

    try {
      const result = auth.register(username, password, confirmPassword, role);

      if (result.success) {
        this.hideModal("registerModal");
        this.showAlert(result.message, "success");
        document.getElementById("registerForm").reset();
      } else {
        this.showAlert(result.message, "error");
      }
    } catch (error) {
      this.showAlert("Error inesperado durante el registro", "error");
    } finally {
      // Restaurar botón
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  logout() {
    auth.logout();
    this.updateUI();
    this.loadCurrentView();
    this.showAlert("¡Sesión cerrada exitosamente!", "info");
  }

  // UI Management
  updateUI() {
    const isLoggedIn = auth.isLoggedIn();
    const isAdmin = auth.isAdmin();
    const user = auth.getCurrentUser();

    // Update navigation
    document.getElementById("loginBtn").classList.toggle("hidden", isLoggedIn);
    document
      .getElementById("registerBtn")
      .classList.toggle("hidden", isLoggedIn);
    document
      .getElementById("logoutBtn")
      .classList.toggle("hidden", !isLoggedIn);
    document.getElementById("userInfo").classList.toggle("hidden", !isLoggedIn);

    if (isLoggedIn) {
      const roleText = user.role === "admin" ? "Administrador" : "Usuario";
      document.getElementById(
        "userInfo"
      ).textContent = `Bienvenido, ${user.username} (${roleText})`;
    }

    // Show/hide admin controls
    document.querySelectorAll(".admin-only").forEach((element) => {
      element.classList.toggle("hidden", !isAdmin);
    });
  }

  switchTab(tabName) {
    this.currentView = tabName;

    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.toggle("active", content.id === tabName);
    });

    this.loadCurrentView();
  }

  loadDefaultView() {
    this.loadTournaments();
  }

  loadCurrentView() {
    switch (this.currentView) {
      case "tournaments":
        this.loadTournaments();
        break;
      case "teams":
        this.loadTeams();
        break;
      case "players":
        this.loadPlayers();
        break;
      case "matches":
        this.loadMatches();
        break;
    }
  }

  // Tournament views
  loadTournaments() {
    const tournaments = tournamentManager.getAll();
    const container = document.getElementById("tournamentsList");

    if (tournaments.length === 0) {
      container.innerHTML =
        '<p class="text-muted">🏆 No hay torneos creados aún. ¡Creá el primer torneo!</p>';
      return;
    }

    container.innerHTML = tournaments
      .map(
        (tournament) => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">🏆 ${tournament.name}</div>
                        <div class="item-meta">
                            📋 Formato: ${
                              tournament.format === "knockout"
                                ? "Eliminatoria"
                                : "Liga"
                            } | Estado: 
                            <span class="status status-${
                              tournament.status
                            }">${this.translateStatus(tournament.status)}</span>
                        </div>
                        <div class="item-meta">
                            📅 Inicio: ${
                              tournament.startDate || "Por definir"
                            } | ⚽ Equipos: ${
          tournament.registeredTeams.length
        }/${tournament.maxTeams}
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-small" onclick="app.viewTournament(${
                          tournament.id
                        })">👁️ Ver Detalles</button>
                        ${
                          auth.isAdmin()
                            ? `
                            <button class="btn btn-small btn-secondary" onclick="app.showTournamentForm(${tournament.id})">✏️ Editar</button>
                            <button class="btn btn-small btn-danger" onclick="app.deleteTournament(${tournament.id})">🗑️ Eliminar</button>
                        `
                            : ""
                        }
                    </div>
                </div>
                ${
                  tournament.description
                    ? `<div class="item-description">${tournament.description}</div>`
                    : ""
                }
            </div>
        `
      )
      .join("");
  }

  viewTournament(id) {
    const tournament = tournamentManager.getById(id);
    if (!tournament) return;

    const matches = matchManager.getByTournament(id);
    const standings = tournamentManager.getStandings(id);

    const teamsInfo = tournament.registeredTeams.map((teamId) => {
      const team = db.readById("teams", teamId);
      return team ? team : { id: teamId, name: "Unknown Team" };
    });

    const detailsPanel = document.getElementById("tournamentDetails");
    detailsPanel.classList.remove("hidden");

    detailsPanel.innerHTML = `
            <div class="details-header">
                <h3 class="details-title">${tournament.name}</h3>
                <div>
                    ${
                      auth.isAdmin()
                        ? `
                        <button class="btn btn-small btn-secondary" onclick="app.generateBracket(${id})">🏆 Generar Fixture</button>
                        <button class="btn btn-small" onclick="app.showTeamRegistration(${id})">⚙️ Gestionar Equipos</button>
                    `
                        : ""
                    }
                    <button class="btn btn-small" onclick="app.hideTournamentDetails()">✖️ Cerrar</button>
                </div>
            </div>
            
            <div class="details-section">
                <h4>📋 Información</h4>
                <p><strong>Formato:</strong> ${
                  tournament.format === "knockout" ? "Eliminatoria" : "Liga"
                }</p>
                <p><strong>Estado:</strong> <span class="status status-${
                  tournament.status
                }">${this.translateStatus(tournament.status)}</span></p>
                <p><strong>Fecha de Inicio:</strong> ${
                  tournament.startDate || "Por definir"
                }</p>
                <p><strong>Fecha de Fin:</strong> ${
                  tournament.endDate || "Por definir"
                }</p>
                ${
                  tournament.description
                    ? `<p><strong>Descripción:</strong> ${tournament.description}</p>`
                    : ""
                }
                ${
                  tournament.rules
                    ? `<p><strong>Reglas:</strong> ${tournament.rules}</p>`
                    : ""
                }
            </div>

            <div class="details-section">
                <h4>👥 Equipos Inscritos (${teamsInfo.length}/${
      tournament.maxTeams
    })</h4>
                ${
                  teamsInfo.length > 0
                    ? `
                    <div class="teams-grid">
                        ${teamsInfo
                          .map(
                            (team) =>
                              `<div class="team-card">${team.name}</div>`
                          )
                          .join("")}
                    </div>
                `
                    : '<p class="text-muted">No hay equipos inscritos aún.</p>'
                }
            </div>

            ${
              standings.length > 0
                ? `
                <div class="details-section">
                    <h4>${
                      tournament.format === "league"
                        ? "Standings"
                        : "Tournament Progress"
                    }</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                ${
                                  tournament.format === "league"
                                    ? `
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
                                `
                                    : `
                                    <th>Team</th>
                                    <th>Status</th>
                                    <th>Current Round</th>
                                `
                                }
                            </tr>
                        </thead>
                        <tbody>
                            ${standings
                              .map(
                                (standing, index) => `
                                <tr>
                                    ${
                                      tournament.format === "league"
                                        ? `
                                        <td>${index + 1}</td>
                                        <td>${standing.teamName}</td>
                                        <td>${standing.played}</td>
                                        <td>${standing.won}</td>
                                        <td>${standing.drawn}</td>
                                        <td>${standing.lost}</td>
                                        <td>${standing.goalsFor}</td>
                                        <td>${standing.goalsAgainst}</td>
                                        <td>${standing.goalDifference}</td>
                                        <td><strong>${
                                          standing.points
                                        }</strong></td>
                                    `
                                        : `
                                        <td>${standing.teamName}</td>
                                        <td><span class="status ${
                                          standing.isEliminated
                                            ? "status-eliminated"
                                            : "status-active"
                                        }">${standing.status}</span></td>
                                        <td>${
                                          standing.currentRound || "Not started"
                                        }</td>
                                    `
                                    }
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            `
                : ""
            }

            ${
              matches.length > 0
                ? `
                <div class="details-section">
                    <h4>Matches</h4>
                    <div class="matches-list">
                        ${matches
                          .map((match) => {
                            const team1 = db.readById("teams", match.team1Id);
                            const team2 = db.readById("teams", match.team2Id);
                            return `
                                <div class="match-card">
                                    <div class="match-teams">
                                        ${team1 ? team1.name : "TBD"} vs ${
                              team2 ? team2.name : "TBD"
                            }
                                    </div>
                                    <div class="match-details">
                                        ${
                                          match.status === "completed"
                                            ? `Score: ${match.team1Score} - ${match.team2Score}`
                                            : `Status: ${match.status}`
                                        }
                                        ${
                                          match.scheduledDate
                                            ? ` | Date: ${match.scheduledDate}`
                                            : ""
                                        }
                                        ${
                                          auth.isAdmin() &&
                                          match.status === "scheduled"
                                            ? `
                                            <button class="btn btn-small" onclick="app.showMatchResult(${match.id})">Record Result</button>
                                        `
                                            : ""
                                        }
                                    </div>
                                </div>
                            `;
                          })
                          .join("")}
                    </div>
                </div>
            `
                : ""
            }
        `;
  }

  hideTournamentDetails() {
    document.getElementById("tournamentDetails").classList.add("hidden");
  }

  generateBracket(tournamentId) {
    const result = tournamentManager.generateBracket(tournamentId);
    if (result.success) {
      this.showAlert(result.message, "success");
      this.viewTournament(tournamentId);
    } else {
      this.showAlert(result.message, "error");
    }
  }

  // Team views
  loadTeams() {
    const teams = teamManager.getAllWithStats();
    const container = document.getElementById("teamsList");

    if (teams.length === 0) {
      container.innerHTML =
        '<p class="text-muted">⚽ No hay equipos registrados aún. ¡Creá el primer equipo!</p>';
      return;
    }

    container.innerHTML = teams
      .map(
        (team) => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">⚽ ${team.name}</div>
                        <div class="item-meta">👥 Jugadores: ${
                          team.playerCount
                        }</div>
                        ${
                          team.coach
                            ? `<div class="item-meta">👨‍🏫 Entrenador: ${team.coach}</div>`
                            : ""
                        }
                    </div>
                    <div class="item-actions">
                        ${
                          auth.isAdmin()
                            ? `
                            <button class="btn btn-small btn-secondary" onclick="app.showTeamForm(${team.id})">✏️ Editar</button>
                            <button class="btn btn-small btn-danger" onclick="app.deleteTeam(${team.id})">🗑️ Eliminar</button>
                        `
                            : ""
                        }
                    </div>
                </div>
                ${
                  team.description
                    ? `<div class="item-description">${team.description}</div>`
                    : ""
                }
            </div>
        `
      )
      .join("");
  }

  // Player views
  loadPlayers() {
    const players = playerManager.getAllWithTeamInfo();
    const container = document.getElementById("playersList");

    if (players.length === 0) {
      container.innerHTML =
        '<p class="text-muted">👥 No hay jugadores registrados aún. ¡Agregá el primer jugador!</p>';
      return;
    }

    container.innerHTML = players
      .map(
        (player) => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">👤 ${player.name}</div>
                        <div class="item-meta">
                            ${
                              player.position
                                ? `⚽ Posición: ${player.position} | `
                                : ""
                            }
                            ${
                              player.age ? `🎂 Edad: ${player.age} años | ` : ""
                            }
                            🏟️ Equipo: ${player.teamName}
                        </div>
                        ${
                          player.jerseyNumber
                            ? `<div class="item-meta">👕 Camiseta: #${player.jerseyNumber}</div>`
                            : ""
                        }
                    </div>
                    <div class="item-actions">
                        ${
                          auth.isAdmin()
                            ? `
                            <button class="btn btn-small btn-secondary" onclick="app.showPlayerForm(${player.id})">✏️ Editar</button>
                            <button class="btn btn-small btn-danger" onclick="app.deletePlayer(${player.id})">🗑️ Eliminar</button>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Match views
  loadMatches() {
    const matches = matchManager.getAllWithTeamInfo();
    const container = document.getElementById("matchesList");

    if (matches.length === 0) {
      container.innerHTML =
        '<p class="text-muted">📅 No hay partidos programados aún. ¡Programá el primer partido!</p>';
      return;
    }

    container.innerHTML = matches
      .map(
        (match) => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">⚽ ${match.team1Name} vs ${
          match.team2Name
        }</div>
                        <div class="item-meta">
                            🏆 Torneo: ${match.tournamentName} | 
                            📊 Estado: <span class="status status-${
                              match.status
                            }">${this.translateStatus(match.status)}</span>
                        </div>
                        ${
                          match.scheduledDate
                            ? `<div class="item-meta">📅 Fecha: ${match.scheduledDate}</div>`
                            : ""
                        }
                        ${
                          match.status === "completed"
                            ? `<div class="item-meta">⚽ Resultado: ${match.team1Score} - ${match.team2Score}</div>`
                            : ""
                        }
                    </div>
                    <div class="item-actions">
                        ${
                          auth.isAdmin()
                            ? `
                            ${
                              match.status === "scheduled"
                                ? `<button class="btn btn-small" onclick="app.showMatchResult(${match.id})">📝 Registrar Resultado</button>`
                                : ""
                            }
                            <button class="btn btn-small btn-secondary" onclick="app.showMatchForm(${
                              match.id
                            })">✏️ Editar</button>
                            <button class="btn btn-small btn-danger" onclick="app.deleteMatch(${
                              match.id
                            })">🗑️ Eliminar</button>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Form handling methods (continued in next part due to length)
  showTournamentForm(id = null) {
    const tournament = id ? tournamentManager.getById(id) : null;
    const isEdit = !!tournament;

    const formHTML = `
            <h2>🏆 ${isEdit ? "Editar" : "Crear"} Torneo</h2>
            <form id="tournamentForm">
                <div class="form-group">
                    <label for="tournamentName">🏆 Nombre del Torneo *</label>
                    <input type="text" id="tournamentName" value="${
                      tournament ? tournament.name : ""
                    }" placeholder="Ej: Copa Argentina 2024" required>
                </div>
                <div class="form-group">
                    <label for="tournamentDescription">📝 Descripción</label>
                    <textarea id="tournamentDescription" placeholder="Describí el torneo y sus características...">${
                      tournament ? tournament.description : ""
                    }</textarea>
                </div>
                <div class="form-group">
                    <label for="tournamentRules">📋 Reglamento</label>
                    <textarea id="tournamentRules" placeholder="Indicá las reglas y normas del torneo...">${
                      tournament ? tournament.rules : ""
                    }</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="tournamentStartDate">📅 Fecha de Inicio *</label>
                        <input type="date" id="tournamentStartDate" value="${
                          tournament ? tournament.startDate : ""
                        }" required>
                    </div>
                    <div class="form-group">
                        <label for="tournamentEndDate">📅 Fecha de Finalización</label>
                        <input type="date" id="tournamentEndDate" value="${
                          tournament ? tournament.endDate : ""
                        }">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="tournamentFormat">🎯 Formato del Torneo</label>
                        <select id="tournamentFormat">
                            <option value="knockout" ${
                              tournament && tournament.format === "knockout"
                                ? "selected"
                                : ""
                            }>🥊 Eliminación Directa</option>
                            <option value="league" ${
                              tournament && tournament.format === "league"
                                ? "selected"
                                : ""
                            }>🔄 Liga (Todos contra Todos)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tournamentMaxTeams">⚽ Cantidad Máxima de Equipos</label>
                        <input type="number" id="tournamentMaxTeams" value="${
                          tournament ? tournament.maxTeams : 16
                        }" min="2" max="64" placeholder="16">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">💾 ${
                      isEdit ? "Actualizar" : "Crear"
                    } Torneo</button>
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">❌ Cancelar</button>
                </div>
            </form>
        `;

    document.getElementById("formContainer").innerHTML = formHTML;
    this.showModal("formModal");

    document
      .getElementById("tournamentForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();

        // Obtener y validar datos del formulario
        const name = document.getElementById("tournamentName").value.trim();
        const description = document
          .getElementById("tournamentDescription")
          .value.trim();
        const rules = document.getElementById("tournamentRules").value.trim();
        const startDate = document.getElementById("tournamentStartDate").value;
        const endDate = document.getElementById("tournamentEndDate").value;
        const format = document.getElementById("tournamentFormat").value;
        const maxTeams = document.getElementById("tournamentMaxTeams").value;

        // Validaciones de frontend
        if (!name) {
          this.showAlert("El nombre del torneo es obligatorio", "error");
          return;
        }

        if (!startDate) {
          this.showAlert("La fecha de inicio es obligatoria", "error");
          return;
        }

        // Validar fechas
        const startDateObj = new Date(startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDateObj < today) {
          this.showAlert(
            "La fecha de inicio no puede ser en el pasado",
            "error"
          );
          return;
        }

        if (endDate) {
          const endDateObj = new Date(endDate);
          if (endDateObj <= startDateObj) {
            this.showAlert(
              "La fecha de fin debe ser posterior a la fecha de inicio",
              "error"
            );
            return;
          }
        }

        const formData = {
          name,
          description,
          rules,
          startDate,
          endDate,
          format,
          maxTeams,
        };

        // Mostrar estado de carga
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = isEdit ? "Actualizando..." : "Creando...";
        submitBtn.disabled = true;

        try {
          let result;
          if (isEdit) {
            result = tournamentManager.update(id, formData);
          } else {
            result = tournamentManager.create(formData);
          }

          if (result.success) {
            this.hideModal("formModal");
            this.loadTournaments();
            this.showAlert(
              result.message ||
                `✅ Torneo ${isEdit ? "actualizado" : "creado"} exitosamente`,
              "success"
            );
          } else {
            this.showAlert(result.message, "error");
          }
        } catch (error) {
          this.showAlert("Error inesperado al procesar el torneo", "error");
        } finally {
          // Restaurar botón
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
  }

  showTeamForm(id = null) {
    const team = id ? teamManager.getById(id) : null;
    const isEdit = !!team;

    const formHTML = `
            <h2>⚽ ${isEdit ? "Editar" : "Crear"} Equipo</h2>
            <form id="teamForm">
                <div class="form-group">
                    <label for="teamName">⚽ Nombre del Equipo *</label>
                    <input type="text" id="teamName" value="${
                      team ? team.name : ""
                    }" placeholder="Ej: Club Atlético Boca Juniors" required>
                </div>
                <div class="form-group">
                    <label for="teamDescription">📝 Descripción</label>
                    <textarea id="teamDescription" placeholder="Describí la historia y características del equipo...">${
                      team ? team.description : ""
                    }</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="teamCoach">👨‍🏫 Entrenador</label>
                        <input type="text" id="teamCoach" value="${
                          team ? team.coach : ""
                        }" placeholder="Nombre del director técnico">
                    </div>
                    <div class="form-group">
                        <label for="teamFoundedDate">📅 Fecha de Fundación</label>
                        <input type="date" id="teamFoundedDate" value="${
                          team ? team.foundedDate : ""
                        }">
                    </div>
                </div>
                <div class="form-group">
                    <label for="teamHomeVenue">🏟️ Estadio</label>
                    <input type="text" id="teamHomeVenue" value="${
                      team ? team.homeVenue : ""
                    }" placeholder="Nombre del estadio donde juega de local">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">💾 ${
                      isEdit ? "Actualizar" : "Crear"
                    } Equipo</button>
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">❌ Cancelar</button>
                </div>
            </form>
        `;

    document.getElementById("formContainer").innerHTML = formHTML;
    this.showModal("formModal");

    document.getElementById("teamForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById("teamName").value,
        description: document.getElementById("teamDescription").value,
        coach: document.getElementById("teamCoach").value,
        foundedDate: document.getElementById("teamFoundedDate").value,
        homeVenue: document.getElementById("teamHomeVenue").value,
      };

      let result;
      if (isEdit) {
        result = teamManager.update(id, formData);
      } else {
        result = teamManager.create(formData);
      }

      if (result.success) {
        this.hideModal("formModal");
        this.loadTeams();
        this.showAlert(
          `✅ Equipo ${isEdit ? "actualizado" : "creado"} exitosamente`,
          "success"
        );
      } else {
        this.showAlert(result.message, "error");
      }
    });
  }

  showPlayerForm(id = null) {
    const player = id ? playerManager.getById(id) : null;
    const isEdit = !!player;
    const teams = teamManager.getAll();

    const formHTML = `
            <h2>👤 ${isEdit ? "Editar" : "Agregar"} Jugador</h2>
            <form id="playerForm">
                <div class="form-group">
                    <label for="playerName">👤 Nombre Completo *</label>
                    <input type="text" id="playerName" value="${
                      player ? player.name : ""
                    }" placeholder="Ej: Lionel Andrés Messi" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="playerAge">🎂 Edad</label>
                        <input type="number" id="playerAge" value="${
                          player ? player.age || "" : ""
                        }" min="16" max="50" placeholder="Años">
                    </div>
                    <div class="form-group">
                        <label for="playerPosition">⚽ Posición</label>
                        <input type="text" id="playerPosition" value="${
                          player ? player.position : ""
                        }" placeholder="Ej: Delantero, Mediocampista, Defensor">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="playerJerseyNumber">👕 Número de Camiseta</label>
                        <input type="number" id="playerJerseyNumber" value="${
                          player ? player.jerseyNumber || "" : ""
                        }" min="1" max="99" placeholder="1-99">
                    </div>
                    <div class="form-group">
                        <label for="playerTeam">🏟️ Equipo</label>
                        <select id="playerTeam">
                            <option value="">Jugador Libre</option>
                            ${teams
                              .map(
                                (team) => `
                                <option value="${team.id}" ${
                                  player && player.teamId === team.id
                                    ? "selected"
                                    : ""
                                }>
                                    ${team.name}
                                </option>
                            `
                              )
                              .join("")}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="playerEmail">📧 Email</label>
                        <input type="email" id="playerEmail" value="${
                          player ? player.email : ""
                        }" placeholder="jugador@email.com">
                    </div>
                    <div class="form-group">
                        <label for="playerPhone">📱 Teléfono</label>
                        <input type="tel" id="playerPhone" value="${
                          player ? player.phone : ""
                        }" placeholder="11-1234-5678">
                    </div>
                </div>
                <div class="form-group">
                    <label for="playerNationality">🌍 Nacionalidad</label>
                    <input type="text" id="playerNationality" value="${
                      player ? player.nationality : ""
                    }" placeholder="Ej: Argentina, Brasil, Uruguay">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">💾 ${
                      isEdit ? "Actualizar" : "Agregar"
                    } Jugador</button>
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">❌ Cancelar</button>
                </div>
            </form>
        `;

    document.getElementById("formContainer").innerHTML = formHTML;
    this.showModal("formModal");

    document.getElementById("playerForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById("playerName").value,
        age: document.getElementById("playerAge").value,
        position: document.getElementById("playerPosition").value,
        jerseyNumber: document.getElementById("playerJerseyNumber").value,
        teamId: document.getElementById("playerTeam").value || null,
        email: document.getElementById("playerEmail").value,
        phone: document.getElementById("playerPhone").value,
        nationality: document.getElementById("playerNationality").value,
      };

      let result;
      if (isEdit) {
        result = playerManager.update(id, formData);
      } else {
        result = playerManager.create(formData);
      }

      if (result.success) {
        this.hideModal("formModal");
        this.loadPlayers();
        this.showAlert(
          `✅ Jugador ${isEdit ? "actualizado" : "agregado"} exitosamente`,
          "success"
        );
      } else {
        this.showAlert(result.message, "error");
      }
    });
  }

  showMatchForm(id = null) {
    const match = id ? matchManager.getById(id) : null;
    const isEdit = !!match;
    const tournaments = tournamentManager.getAll();
    const teams = teamManager.getAll();

    const formHTML = `
            <h2>${isEdit ? "Edit" : "Add"} Match</h2>
            <form id="matchForm">
                <div class="form-group">
                    <label for="matchTournament">Tournament *</label>
                    <select id="matchTournament" required>
                        <option value="">Select Tournament</option>
                        ${tournaments
                          .map(
                            (tournament) => `
                            <option value="${tournament.id}" ${
                              match && match.tournamentId === tournament.id
                                ? "selected"
                                : ""
                            }>
                                ${tournament.name}
                            </option>
                        `
                          )
                          .join("")}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="matchTeam1">Team 1 *</label>
                        <select id="matchTeam1" required>
                            <option value="">Select Team 1</option>
                            ${teams
                              .map(
                                (team) => `
                                <option value="${team.id}" ${
                                  match && match.team1Id === team.id
                                    ? "selected"
                                    : ""
                                }>
                                    ${team.name}
                                </option>
                            `
                              )
                              .join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="matchTeam2">Team 2 *</label>
                        <select id="matchTeam2" required>
                            <option value="">Select Team 2</option>
                            ${teams
                              .map(
                                (team) => `
                                <option value="${team.id}" ${
                                  match && match.team2Id === team.id
                                    ? "selected"
                                    : ""
                                }>
                                    ${team.name}
                                </option>
                            `
                              )
                              .join("")}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="matchDate">Date</label>
                        <input type="date" id="matchDate" value="${
                          match ? match.scheduledDate || "" : ""
                        }">
                    </div>
                    <div class="form-group">
                        <label for="matchTime">Time</label>
                        <input type="time" id="matchTime" value="${
                          match ? match.scheduledTime || "" : ""
                        }">
                    </div>
                </div>
                <div class="form-group">
                    <label for="matchVenue">Venue</label>
                    <input type="text" id="matchVenue" value="${
                      match ? match.venue : ""
                    }">
                </div>
                <div class="form-group">
                    <label for="matchRound">Round</label>
                    <input type="number" id="matchRound" value="${
                      match ? match.round : 1
                    }" min="1">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">${
                      isEdit ? "Update" : "Create"
                    } Match</button>
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">Cancel</button>
                </div>
            </form>
        `;

    document.getElementById("formContainer").innerHTML = formHTML;
    this.showModal("formModal");

    document.getElementById("matchForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        tournamentId: document.getElementById("matchTournament").value,
        team1Id: document.getElementById("matchTeam1").value,
        team2Id: document.getElementById("matchTeam2").value,
        scheduledDate: document.getElementById("matchDate").value,
        scheduledTime: document.getElementById("matchTime").value,
        venue: document.getElementById("matchVenue").value,
        round: document.getElementById("matchRound").value,
      };

      let result;
      if (isEdit) {
        result = matchManager.update(id, formData);
      } else {
        result = matchManager.create(formData);
      }

      if (result.success) {
        this.hideModal("formModal");
        this.loadMatches();
        this.showAlert(
          `Match ${isEdit ? "updated" : "created"} successfully!`,
          "success"
        );
      } else {
        this.showAlert(result.message, "error");
      }
    });
  }

  showMatchResult(matchId) {
    const match = matchManager.getById(matchId);
    if (!match) return;

    const team1 = db.readById("teams", match.team1Id);
    const team2 = db.readById("teams", match.team2Id);

    const formHTML = `
            <h2>Record Match Result</h2>
            <form id="resultForm">
                <div class="match-info">
                    <h3>${team1 ? team1.name : "TBD"} vs ${
      team2 ? team2.name : "TBD"
    }</h3>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="team1Score">${
                          team1 ? team1.name : "Team 1"
                        } Score</label>
                        <input type="number" id="team1Score" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="team2Score">${
                          team2 ? team2.name : "Team 2"
                        } Score</label>
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

    document.getElementById("formContainer").innerHTML = formHTML;
    this.showModal("formModal");

    document.getElementById("resultForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const team1Score = document.getElementById("team1Score").value;
      const team2Score = document.getElementById("team2Score").value;
      const notes = document.getElementById("matchNotes").value;

      const result = matchManager.recordResult(
        matchId,
        team1Score,
        team2Score,
        notes
      );

      if (result.success) {
        this.hideModal("formModal");
        this.loadMatches();
        this.showAlert(result.message, "success");
      } else {
        this.showAlert(result.message, "error");
      }
    });
  }

  // Delete methods
  deleteTournament(id) {
    if (
      confirm(
        "🏆 ¿Estás seguro de que querés eliminar este torneo? Esta acción también eliminará todos los partidos relacionados y no se puede deshacer."
      )
    ) {
      const result = tournamentManager.delete(id);
      if (result.success) {
        this.loadTournaments();
        this.showAlert("🗑️ Torneo eliminado exitosamente", "success");
      } else {
        this.showAlert(result.message, "error");
      }
    }
  }

  deleteTeam(id) {
    if (
      confirm(
        "⚽ ¿Estás seguro de que querés eliminar este equipo? Los jugadores del equipo quedarán como jugadores libres."
      )
    ) {
      const result = teamManager.delete(id);
      if (result.success) {
        this.loadTeams();
        this.showAlert("🗑️ Equipo eliminado exitosamente", "success");
      } else {
        this.showAlert(result.message, "error");
      }
    }
  }

  deletePlayer(id) {
    if (
      confirm(
        "👤 ¿Estás seguro de que querés eliminar este jugador? Esta acción no se puede deshacer."
      )
    ) {
      const result = playerManager.delete(id);
      if (result.success) {
        this.loadPlayers();
        this.showAlert("🗑️ Jugador eliminado exitosamente", "success");
      } else {
        this.showAlert(result.message, "error");
      }
    }
  }

  deleteMatch(id) {
    if (
      confirm(
        "📅 ¿Estás seguro de que querés eliminar este partido? Se perderán todos los datos del encuentro."
      )
    ) {
      const result = matchManager.delete(id);
      if (result.success) {
        this.loadMatches();
        this.showAlert("🗑️ Partido eliminado exitosamente", "success");
      } else {
        this.showAlert(result.message, "error");
      }
    }
  }

  // Utility methods
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  hideModal(modalId) {
    document.getElementById(modalId).classList.add("hidden");
  }

  showAlert(message, type = "info") {
    // Eliminar alertas existentes para evitar acumulación
    const existingAlerts = document.querySelectorAll(".alert");
    existingAlerts.forEach((alert) => alert.remove());

    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<span>${message}</span>`;

    // Agregar botón de cerrar
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
      margin-left: auto;
      color: inherit;
      opacity: 0.7;
    `;
    closeBtn.addEventListener("click", () => alertDiv.remove());
    alertDiv.appendChild(closeBtn);

    alertDiv.style.display = "flex";
    alertDiv.style.justifyContent = "space-between";
    alertDiv.style.alignItems = "center";

    const container = document.querySelector(".main .container");
    if (container) {
      container.insertBefore(alertDiv, container.firstChild);

      // Auto-remove después de 5 segundos
      const timeoutId = setTimeout(() => {
        if (alertDiv.parentNode) {
          alertDiv.remove();
        }
      }, 5000);

      // Limpiar timeout si se cierra manualmente
      closeBtn.addEventListener("click", () => clearTimeout(timeoutId));
    }
  }

  // Utility methods
  translateStatus(status) {
    const translations = {
      upcoming: "Por Comenzar",
      active: "En Curso",
      completed: "Finalizado",
      scheduled: "Programado",
      pending: "Pendiente",
      eliminated: "Eliminado",
    };
    return translations[status] || status;
  }

  // Team registration management
  showTeamRegistration(tournamentId) {
    const tournament = tournamentManager.getById(tournamentId);
    if (!tournament) return;

    const allTeams = teamManager.getAll();
    const registeredTeamIds = tournament.registeredTeams;
    const availableTeams = allTeams.filter(
      (team) => !registeredTeamIds.includes(team.id)
    );

    const formHTML = `
            <h2>📋 Gestionar Equipos - ${tournament.name}</h2>
            <div class="team-registration">
                <div class="registration-section">
                    <h3>🏆 Equipos Inscritos (${registeredTeamIds.length}/${
      tournament.maxTeams
    })</h3>
                    <div class="registered-teams">
                        ${
                          registeredTeamIds.length > 0
                            ? registeredTeamIds
                                .map((teamId) => {
                                  const team = allTeams.find(
                                    (t) => t.id === teamId
                                  );
                                  return team
                                    ? `
                                    <div class="team-registration-card registered">
                                        <span class="team-name">${team.name}</span>
                                        <button class="btn btn-small btn-danger" onclick="app.unregisterTeam(${tournamentId}, ${teamId})">
                                            ❌ Desincribir
                                        </button>
                                    </div>
                                `
                                    : "";
                                })
                                .join("")
                            : '<p class="text-muted">No hay equipos inscritos</p>'
                        }
                    </div>
                </div>
                
                <div class="registration-section">
                    <h3>👥 Equipos Disponibles</h3>
                    <div class="available-teams">
                        ${
                          availableTeams.length > 0
                            ? availableTeams
                                .map(
                                  (team) => `
                                <div class="team-registration-card available">
                                    <span class="team-name">${team.name}</span>
                                    <button class="btn btn-small btn-success" onclick="app.registerTeam(${tournamentId}, ${team.id})">
                                        ✅ Inscribir
                                    </button>
                                </div>
                            `
                                )
                                .join("")
                            : '<p class="text-muted">No hay equipos disponibles</p>'
                        }
                    </div>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="app.hideModal('formModal')">✖️ Cerrar</button>
            </div>
        `;

    document.getElementById("formContainer").innerHTML = formHTML;
    this.showModal("formModal");
  }

  registerTeam(tournamentId, teamId) {
    const result = tournamentManager.registerTeam(tournamentId, teamId);
    if (result.success) {
      this.showAlert("✅ Equipo inscrito exitosamente", "success");
      this.showTeamRegistration(tournamentId); // Refresh the modal
      this.viewTournament(tournamentId); // Refresh the tournament view
    } else {
      this.showAlert(result.message, "error");
    }
  }

  unregisterTeam(tournamentId, teamId) {
    if (
      confirm(
        "¿Estás seguro de que quieres desincribir este equipo del torneo?"
      )
    ) {
      const result = tournamentManager.unregisterTeam(tournamentId, teamId);
      if (result.success) {
        this.showAlert("✅ Equipo desinscrito exitosamente", "success");
        this.showTeamRegistration(tournamentId); // Refresh the modal
        this.viewTournament(tournamentId); // Refresh the tournament view
      } else {
        this.showAlert(result.message, "error");
      }
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.app = new App();
  } catch (error) {
    console.error("Error initializing app:", error);
  }
});
