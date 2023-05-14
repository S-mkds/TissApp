import instance from './config';

const userService = {
	// Créer un utilisateur
	async createUser(data) {
		try {
			const response = await instance.post('/auth/signup', data);

			if (response.status === 200 || response.status === 201) {
				return { success: true, data: response.data };
			}

			return { success: false, error: response.data.message || "Erreur lors de la création de l'utilisateur." };

		} catch (error) {
			return { success: false, error: error.response?.data.message || "Erreur lors de la création de l'utilisateur." };
		}
	},

	// Connecter un utilisateur
	async connectUser(data) {
		try {
			const response = await instance.post('/auth/login', data);
			return response.data;
		} catch (error) {
			return error.response.data;
		}
	},

	// Récupérer les données de l'utilisateur via son token
	async getMe(userId) {
		try {

			const response = await instance.get(`/users/${userId}`);
			if (response && response.data) {
				return { data: response.data };
			}
			console.log("Response or response data is null");
			return null;
		} catch (error) {
			console.error("Error in getMe:", error);
			return error.response.data;
		}
	},

	// Récupérer un seul user via son id
	async findOneUser(id) {
		try {
			const response = await instance.get(`/users/${id}`);
			return response.data;
		} catch (error) {
			return error.response.data;
		}
	},

	// Récupérer toutes les utilisateurs
	async findUsers() {
		try {
			const response = await instance.get('/users?search');
			return response;
		} catch (error) {
			return error.response.data;
		}
	},

	// Modifier un utilisateur
	async updateUser(updatedUser) {
		try {
			const response = await instance.put('/auth/edit', updatedUser);
			return response.data;
		} catch (error) {
			console.error('Error updating user:', error);
			return { error: error.response.data };
		}
	},

	// Mofication des utilisateur dans le tableau: 
	async updateUserById(id, updatedUser) {
		try {
			const response = await instance.put(`/auth/edit-admin/${id}`, updatedUser);
			return response.data;
		} catch (error) {
			console.error('Error updating user:', error);
			return { error: error.response.data };
		}
	},


	// Supprimer un utilisateur
	async destroyUser(id) {
		try {
			const response = await instance.delete(`/auth/users-delete/${id}`);
			return response.data;
		} catch (error) {
			console.error('Error updating user:', error);
			return { error: error.response.data };
		}
	},

	// Récupération des messages
	async getPosts() {
		try {
			const response = await instance.get('/posts');
			return response;
		} catch (error) {
			return error.response.data;
		}
	},

	// Envoie message
	async sendPosts(formData) {
		try {
			const response = await instance.post('/posts', formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
			console.log("fromsend", response)
			return response;
		} catch (error) {
			return error.response.data;
		}
	},

	// Supprimer un message
	async deletePost(PostId) {
		try {
			const response = await instance.delete(`/posts/${PostId}`);
			console.log("fromDelete", response);
			return response;
		} catch (error) {
			return error.response.data;
		}
	}

};

export default userService;
