// Authentication System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }

    // Load current user from session storage
    loadCurrentUser() {
        const userData = sessionStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // Save current user to session storage
    saveCurrentUser() {
        if (this.currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }

    // Login user
    login(username, password) {
        const users = db.readAll('users');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = { id: user.id, username: user.username, role: user.role };
            this.saveCurrentUser();
            return { success: true, user: this.currentUser };
        }
        
        return { success: false, message: 'Invalid username or password' };
    }

    // Register new user
    register(username, password, confirmPassword, role = 'user') {
        // Validation
        if (!username || !password || !confirmPassword) {
            return { success: false, message: 'All fields are required' };
        }

        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters long' };
        }

        // Check if username already exists
        const users = db.readAll('users');
        if (users.find(u => u.username === username)) {
            return { success: false, message: 'Username already exists' };
        }

        // Create new user
        const newUser = {
            username: username,
            password: password,
            role: role
        };

        const createdUser = db.create('users', newUser);
        
        return { success: true, message: 'Registration successful! You can now login.' };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.saveCurrentUser();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Validate session
    validateSession() {
        if (this.currentUser) {
            const users = db.readAll('users');
            const user = users.find(u => u.id === this.currentUser.id);
            if (!user) {
                this.logout();
                return false;
            }
        }
        return this.isLoggedIn();
    }
}

// Global auth manager instance
const auth = new AuthManager();