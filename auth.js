// Authentication System
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.loadCurrentUser();
  }

  // Load current user from session storage
  loadCurrentUser() {
    const userData = sessionStorage.getItem("currentUser");
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  // Save current user to session storage
  saveCurrentUser() {
    if (this.currentUser) {
      sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
    } else {
      sessionStorage.removeItem("currentUser");
    }
  }

  // Login user
  login(username, password) {
    // Validaciones básicas
    if (!username || !password) {
      return {
        success: false,
        message: "Por favor, complete todos los campos",
      };
    }

    const users = db.readAll("users");
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      this.currentUser = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      this.saveCurrentUser();
      return { success: true, user: this.currentUser };
    }

    return { success: false, message: "Usuario o contraseña incorrectos" };
  }

  // Register new user
  register(username, password, confirmPassword, role = "user") {
    // Validaciones
    if (!username || !password || !confirmPassword) {
      return { success: false, message: "Todos los campos son obligatorios" };
    }

    // Validar formato de nombre de usuario
    if (username.length < 3) {
      return {
        success: false,
        message: "El nombre de usuario debe tener al menos 3 caracteres",
      };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return {
        success: false,
        message:
          "El nombre de usuario solo puede contener letras, números y guiones bajos",
      };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Las contraseñas no coinciden" };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    // Validar complejidad de contraseña
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return {
        success: false,
        message: "La contraseña debe contener al menos una letra y un número",
      };
    }

    // Verificar si el nombre de usuario ya existe
    const users = db.readAll("users");
    if (
      users.find((u) => u.username.toLowerCase() === username.toLowerCase())
    ) {
      return { success: false, message: "El nombre de usuario ya está en uso" };
    }

    // Crear nuevo usuario
    const newUser = {
      username: username,
      password: password,
      role: role,
    };

    const createdUser = db.create("users", newUser);

    return {
      success: true,
      message: "¡Registro exitoso! Ahora puedes iniciar sesión.",
    };
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
    return this.currentUser && this.currentUser.role === "admin";
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Validate session
  validateSession() {
    if (this.currentUser) {
      const users = db.readAll("users");
      const user = users.find((u) => u.id === this.currentUser.id);
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
