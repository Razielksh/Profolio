const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080/api' : '/api');

export const authService = {
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Error al iniciar sesión');
            error.status = response.status;
            error.fieldErrors = data.fieldErrors || null;
            throw error;
        }

        const usuarioFormateado = {
            id: data.user.id,
            nombre: data.user.name,
            email: data.user.email,
            rol: data.user.roles?.includes('ROLE_ADMIN')
                ? 'Admin'
                : data.user.roles?.includes('ROLE_RECLUTADOR')
                    ? 'Reclutador'
                    : 'Usuario',
            roles: data.user.roles,
        };

        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioFormateado));

        return usuarioFormateado;
    },

    async register(name, email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Error al registrar la cuenta');
            error.status = response.status;
            error.fieldErrors = data.fieldErrors || null;
            throw error;
        }

        const usuarioFormateado = {
            id: data.user.id,
            nombre: data.user.name,
            email: data.user.email,
            rol: data.user.roles?.includes('ROLE_ADMIN')
                ? 'Admin'
                : data.user.roles?.includes('ROLE_RECLUTADOR')
                    ? 'Reclutador'
                    : 'Usuario',
            roles: data.user.roles,
        };

        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioFormateado));

        return usuarioFormateado;
    },

    logout() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('usuario_activo');
    },

    getToken() {
        return localStorage.getItem('jwt_token');
    },

    getAuthHeader() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };
    }
};
