// Simulated Database using localStorage
class Database {
  constructor() {
    this.initializeData();
  }

  // Initialize default data if not exists
  initializeData() {
    if (!localStorage.getItem("tournament_users")) {
      const defaultUsers = [
        {
          id: 1,
          username: "admin",
          password: "admin123",
          role: "admin",
        },
        {
          id: 2,
          username: "usuario",
          password: "usuario123",
          role: "user",
        },
      ];
      this.save("users", defaultUsers);
    }

    if (!localStorage.getItem("tournament_tournaments")) {
      const defaultTournaments = [
        {
          id: 1,
          name: "Copa de la Liga Profesional 2024",
          description:
            "Torneo oficial de la Liga Profesional de Fútbol Argentino",
          rules:
            "Sistema de eliminación directa. Partidos de ida y vuelta en semifinales y final.",
          startDate: "2024-02-15",
          endDate: "2024-06-30",
          format: "knockout",
          status: "upcoming",
          maxTeams: 16,
          registeredTeams: [1, 2, 3, 4, 5, 6, 7, 8],
          bracket: null,
          standings: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Torneo de Verano Buenos Aires",
          description:
            "Competencia amistosa de pretemporada entre equipos de Buenos Aires",
          rules:
            "Liga de todos contra todos. Tres puntos por victoria, uno por empate.",
          startDate: "2024-01-10",
          endDate: "2024-02-28",
          format: "league",
          status: "active",
          maxTeams: 8,
          registeredTeams: [1, 2, 3, 4],
          bracket: null,
          standings: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.save("tournaments", defaultTournaments);
    }

    if (!localStorage.getItem("tournament_teams")) {
      const defaultTeams = [
        {
          id: 1,
          name: "Club Atlético Boca Juniors",
          logo: "",
          description: "El club más popular de Argentina, con sede en La Boca",
          players: [1, 2, 3],
          foundedDate: "1905-04-03",
          coach: "Jorge Almirón",
          homeVenue: "La Bombonera",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Club Atlético River Plate",
          logo: "",
          description: "El Millonario, club histórico de Buenos Aires",
          players: [4, 5, 6],
          foundedDate: "1901-05-25",
          coach: "Martín Demichelis",
          homeVenue: "Estadio Monumental",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Racing Club",
          logo: "",
          description: "La Academia, primer campeón mundial argentino",
          players: [7, 8, 9],
          foundedDate: "1903-03-25",
          coach: "Fernando Gago",
          homeVenue: "Estadio Presidente Perón",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 4,
          name: "Club Atlético Independiente",
          logo: "",
          description:
            "El Rey de Copas, máximo ganador de la Copa Libertadores",
          players: [10, 11, 12],
          foundedDate: "1905-01-01",
          coach: "Carlos Tevez",
          homeVenue: "Estadio Libertadores de América",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 5,
          name: "Club Atlético San Lorenzo",
          logo: "",
          description: "El Ciclón, equipo del barrio de Boedo",
          players: [13, 14, 15],
          foundedDate: "1908-04-01",
          coach: "Rubén Darío Insúa",
          homeVenue: "Estadio Pedro Bidegain",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 6,
          name: "Estudiantes de La Plata",
          logo: "",
          description: "El Pincha, histórico club platense",
          players: [16, 17, 18],
          foundedDate: "1905-08-04",
          coach: "Eduardo Domínguez",
          homeVenue: "Estadio Jorge Luis Hirschi",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 7,
          name: "Club Atlético Vélez Sarsfield",
          logo: "",
          description: "El Fortín, campeón del mundo en 1994",
          players: [19, 20, 21],
          foundedDate: "1910-01-01",
          coach: "Gustavo Quinteros",
          homeVenue: "Estadio José Amalfitani",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 8,
          name: "Argentinos Juniors",
          logo: "",
          description: "El Semillero del Mundo, cuna de Diego Maradona",
          players: [22, 23, 24],
          foundedDate: "1904-08-15",
          coach: "Gabriel Milito",
          homeVenue: "Estadio Diego Armando Maradona",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.save("teams", defaultTeams);
    }

    if (!localStorage.getItem("tournament_players")) {
      const defaultPlayers = [
        // Boca Juniors
        {
          id: 1,
          name: "Sergio Romero",
          age: 37,
          position: "Arquero",
          jerseyNumber: 1,
          teamId: 1,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2023-01-15",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Cristian Medina",
          age: 21,
          position: "Mediocampista",
          jerseyNumber: 8,
          teamId: 1,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2022-05-20",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Darío Benedetto",
          age: 33,
          position: "Delantero",
          jerseyNumber: 9,
          teamId: 1,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2023-07-10",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // River Plate
        {
          id: 4,
          name: "Franco Armani",
          age: 37,
          position: "Arquero",
          jerseyNumber: 1,
          teamId: 2,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2018-01-15",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 5,
          name: "Enzo Pérez",
          age: 38,
          position: "Mediocampista",
          jerseyNumber: 24,
          teamId: 2,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2021-03-10",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 6,
          name: "Miguel Borja",
          age: 31,
          position: "Delantero",
          jerseyNumber: 9,
          teamId: 2,
          email: "",
          phone: "",
          nationality: "Colombia",
          height: "",
          weight: "",
          joinDate: "2022-07-05",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // Racing Club
        {
          id: 7,
          name: "Gabriel Arias",
          age: 31,
          position: "Arquero",
          jerseyNumber: 1,
          teamId: 3,
          email: "",
          phone: "",
          nationality: "Chile",
          height: "",
          weight: "",
          joinDate: "2020-01-20",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 8,
          name: "Aníbal Moreno",
          age: 29,
          position: "Mediocampista",
          jerseyNumber: 5,
          teamId: 3,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2021-02-15",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 9,
          name: "Adrián Martínez",
          age: 26,
          position: "Delantero",
          jerseyNumber: 9,
          teamId: 3,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2023-01-10",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // Independiente
        {
          id: 10,
          name: "Rodrigo Rey",
          age: 29,
          position: "Arquero",
          jerseyNumber: 1,
          teamId: 4,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2022-12-01",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 11,
          name: "Federico Mancuello",
          age: 34,
          position: "Mediocampista",
          jerseyNumber: 10,
          teamId: 4,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2023-01-05",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 12,
          name: "Gabriel Ávalos",
          age: 30,
          position: "Delantero",
          jerseyNumber: 9,
          teamId: 4,
          email: "",
          phone: "",
          nationality: "Paraguay",
          height: "",
          weight: "",
          joinDate: "2022-06-15",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // San Lorenzo
        {
          id: 13,
          name: "Gastón Gómez",
          age: 28,
          position: "Arquero",
          jerseyNumber: 1,
          teamId: 5,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2022-01-10",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 14,
          name: "Agustín Giay",
          age: 22,
          position: "Defensor",
          jerseyNumber: 4,
          teamId: 5,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2021-07-20",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 15,
          name: "Iván Leguizamón",
          age: 26,
          position: "Delantero",
          jerseyNumber: 9,
          teamId: 5,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2023-02-01",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // Estudiantes
        {
          id: 16,
          name: "Mariano Andújar",
          age: 40,
          position: "Arquero",
          jerseyNumber: 1,
          teamId: 6,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2020-01-15",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 17,
          name: "Fernando Zuqui",
          age: 31,
          position: "Mediocampista",
          jerseyNumber: 8,
          teamId: 6,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2019-06-10",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 18,
          name: "Mauro Boselli",
          age: 38,
          position: "Delantero",
          jerseyNumber: 9,
          teamId: 6,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2021-01-20",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // Vélez Sarsfield
        {
          id: 19,
          name: "Lucas Hoyos",
          age: 29,
          position: "Arquero",
          jerseyNumber: 1,
          teamId: 7,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2021-12-01",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 20,
          name: "Ricardo Centurión",
          age: 31,
          position: "Mediocampista",
          jerseyNumber: 10,
          teamId: 7,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2023-01-15",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 21,
          name: "Walter Bou",
          age: 30,
          position: "Delantero",
          jerseyNumber: 7,
          teamId: 7,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2022-01-10",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // Argentinos Juniors
        {
          id: 22,
          name: "Federico Lanzillota",
          age: 28,
          position: "Arquero",
          jerseyNumber: 1,
          teamId: 8,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2020-06-15",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 23,
          name: "Gastón Verón",
          age: 25,
          position: "Mediocampista",
          jerseyNumber: 8,
          teamId: 8,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2022-02-10",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 24,
          name: "Gabriel Ávalos",
          age: 29,
          position: "Delantero",
          jerseyNumber: 9,
          teamId: 8,
          email: "",
          phone: "",
          nationality: "Argentina",
          height: "",
          weight: "",
          joinDate: "2021-07-05",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.save("players", defaultPlayers);
    }

    if (!localStorage.getItem("tournament_matches")) {
      this.save("matches", []);
    }
  }

  // Generic CRUD operations
  save(collection, data) {
    localStorage.setItem(`tournament_${collection}`, JSON.stringify(data));
  }

  load(collection) {
    const data = localStorage.getItem(`tournament_${collection}`);
    return data ? JSON.parse(data) : [];
  }

  // Generate unique ID
  generateId(collection) {
    const items = this.load(collection);
    return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  }

  // Generic create
  create(collection, item) {
    const items = this.load(collection);
    item.id = this.generateId(collection);
    item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    items.push(item);
    this.save(collection, items);
    return item;
  }

  // Generic read all
  readAll(collection) {
    return this.load(collection);
  }

  // Generic read by ID
  readById(collection, id) {
    const items = this.load(collection);
    return items.find((item) => item.id === parseInt(id));
  }

  // Generic update
  update(collection, id, updates) {
    const items = this.load(collection);
    const index = items.findIndex((item) => item.id === parseInt(id));
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.save(collection, items);
      return items[index];
    }
    return null;
  }

  // Generic delete
  delete(collection, id) {
    const items = this.load(collection);
    const filteredItems = items.filter((item) => item.id !== parseInt(id));
    this.save(collection, filteredItems);
    return filteredItems.length < items.length;
  }

  // Search/filter operations
  filter(collection, filterFn) {
    const items = this.load(collection);
    return items.filter(filterFn);
  }

  // Find by field value
  findBy(collection, field, value) {
    const items = this.load(collection);
    return items.filter((item) => item[field] === value);
  }
}

// Global database instance
const db = new Database();
