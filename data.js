// Simulated Database using localStorage
class Database {
    constructor() {
        this.initializeData();
    }

    // Initialize default data if not exists
    initializeData() {
        if (!localStorage.getItem('tournament_users')) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin'
                },
                {
                    id: 2,
                    username: 'user',
                    password: 'user123',
                    role: 'user'
                }
            ];
            this.save('users', defaultUsers);
        }

        if (!localStorage.getItem('tournament_tournaments')) {
            this.save('tournaments', []);
        }

        if (!localStorage.getItem('tournament_teams')) {
            this.save('teams', []);
        }

        if (!localStorage.getItem('tournament_players')) {
            this.save('players', []);
        }

        if (!localStorage.getItem('tournament_matches')) {
            this.save('matches', []);
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
        return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
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
        return items.find(item => item.id === parseInt(id));
    }

    // Generic update
    update(collection, id, updates) {
        const items = this.load(collection);
        const index = items.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
            this.save(collection, items);
            return items[index];
        }
        return null;
    }

    // Generic delete
    delete(collection, id) {
        const items = this.load(collection);
        const filteredItems = items.filter(item => item.id !== parseInt(id));
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
        return items.filter(item => item[field] === value);
    }
}

// Global database instance
const db = new Database();