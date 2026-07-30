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
            nombre: data.user.nombre || data.user.name || 'Usuario',
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
            nombre: data.user.nombre || data.user.name || name || 'Usuario',
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

export const userService = {
    async getUsers(page = 0, size = 5, search = '', role = 'Todos') {
        const params = new URLSearchParams({ page, size, search, role });
        const response = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
            headers: authService.getAuthHeader(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener usuarios de la base de datos');
        }
        return data;
    },

    async createUser(userData) {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST',
            headers: authService.getAuthHeader(),
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.message || 'Error al crear usuario');
            error.fieldErrors = data.fieldErrors || null;
            throw error;
        }
        return data;
    },

    async updateUser(id, userData) {
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: 'PUT',
            headers: authService.getAuthHeader(),
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.message || 'Error al actualizar usuario');
            error.fieldErrors = data.fieldErrors || null;
            throw error;
        }
        return data;
    },

    async toggleUserStatus(id) {
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}/toggle-status`, {
            method: 'PATCH',
            headers: authService.getAuthHeader(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error al cambiar estado del usuario');
        }
        return data;
    },

    async deleteUser(id) {
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: authService.getAuthHeader(),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error al eliminar usuario');
        }
        return true;
    }
};

export const cvService = {
    async saveCv(cvData) {
        const response = await fetch(`${API_BASE_URL}/cv/save`, {
            method: 'POST',
            headers: authService.getAuthHeader(),
            body: JSON.stringify(cvData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error al guardar el CV');
        }
        return data; // CvResponseDto con id, titulo, etc.
    },

    async getMyCvs() {
        const response = await fetch(`${API_BASE_URL}/cv/my-cvs`, {
            headers: authService.getAuthHeader(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener los CVs');
        }
        return data; // array de CvResponseDto
    },

    async getCvById(id) {
        const response = await fetch(`${API_BASE_URL}/cv/${id}`, {
            headers: authService.getAuthHeader(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener el CV');
        }
        return data; // CvResponseDto
    },

    async deleteCv(id) {
        const response = await fetch(`${API_BASE_URL}/cv/${id}`, {
            method: 'DELETE',
            headers: authService.getAuthHeader(),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error al eliminar el CV');
        }
        return true;
    }
};
