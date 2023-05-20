import { useCallback, useState } from 'react';
import jwtDecode from 'jwt-decode';
import userService from '../services/userService';

export default function useAuth() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [id, setId] = useState(null);
	const [user, setUser] = useState('');
	const [users, setUsers] = useState([]);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [imageUrl, setImageUrl] = useState(null);
	const [messages, setMessages] = useState([]);
	const [imageContent, setImageContent] = useState([]);
	const [createdUser, setCreatedUser] = useState(null);


	const handleCreateUser = useCallback(async (data) => {
		setLoading(true);
		setError(null);
		try {
			const response = await userService.createUser(data);
			setLoading(false);
			if (response.error) {
				setError(response.error);
				return { error: response.error }; // Return error response
			}

			setCreatedUser(response.data);
			return { data: response.data }; // Return data response
		} catch (error) {
			setLoading(false);
			setError(error.message);
			return { error: error.message }; // Return error response
		}
	}, []);


	// Connexion d'un utilisateur
	const login = useCallback(async (data) => {
		setLoading(true);
		setError(null);

		const response = await userService.connectUser(data);
		
		if (response.error) {
			setError(response.error);
			setLoading(false);
			throw new Error(response.error);
		}
		setLoading(false);
		localStorage.setItem('token', response.token);
		const user = response.user || null;

		// Récupérer l'ID de l'utilisateur
		const userId = user ? user.id : null;
		setId(userId)
		return user;
	}, []);

	// Pour la déconnexion
	const logout = useCallback(() => {
		localStorage.removeItem('token');
	}, []);

	// Récupérationdes données de l'utilisateur connecter grace à son Id
	const handleUser = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem('token');
			const decodedToken = jwtDecode(token);
			const { userId } = decodedToken;

			const response = await userService.findOneUser(userId);
			setLoading(false);

			if (response.error) {
				setError(response.error);
				throw new Error(response.error);
			} else {
				const { user } = response;

				setUser(user);
				setFirstName(user.firstName);
				setLastName(user.lastName);
				setEmail(user.email);
				setImageUrl(user.imageUrl || '');
				return response.data;
			}
		} catch (error) {
			setLoading(false);
			setError(error.message);
			throw new Error(error.message);
		}
	}, []);

	// Mise à jour des données de l'utilisateur
	const handleUpdateUser = async (updatedUser) => {
		setLoading(true);
		try {
			const response = await userService.updateUser(updatedUser);
			if (response.error) {
				setError(response.error);
				return { error: response.error };
			}
			setError(null);
			return updatedUser;
		} catch (e) {
			setError(e);
			return { error: e };
		} finally {
			setLoading(false);
		}
	};

	// Mise à jour des données de tous les utilisateurs
	const handleAllUpdateUser = async (id, updatedUser) => {
		setLoading(true);
		try {
			const response = await userService.updateUserById(id, updatedUser);
			if (response.error) {
				setError(response.error);
				return { error: response.error };
			}
			setError(null);
			return updatedUser;
		} catch (e) {
			setError(e);
			return { error: e };
		} finally {
			setLoading(false);
		}
	};

	// supprimer un utilisateur
	const handleDestroyUser = async (id) => {
		setLoading(true);
		setError(null);

		try {
			const response = await userService.destroyUser(id);
			setLoading(false);
			return response;
		} catch (error) {
			setError(error.response.data);
			setLoading(false);
			return error.response.data;
		}
	};



	// Récupéraripon de tous les utilisateurs
	const handleAllUsers = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			
			const response = await userService.findUsers();
			setLoading(false);
			if (response.error) {
				setError(response.error);
				throw new Error(response.error);
			} else {
				setUsers(response.data.users)
				return response.data;
			}
		} catch (error) {
			setLoading(false);
			setError(error.message);
			throw new Error(error.message);
		}
	}, []);
	
	

	// Récupération des messages postés
	const handlePosts= useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			
			const response = await userService.getPosts();
			setLoading(false);
			if (response.error) {
				setError(response.error);
				throw new Error(response.error);
			} else {
				setMessages(response.data.posts)
				setImageContent(response.data.posts.imageUrl)
				return response.data;
			}
		} catch (error) {
			setLoading(false);
			setError(error.message);
			throw new Error(error.message);
		}
	}, []);
	return {
		id, setId, user, users, firstName, lastName, email, imageUrl, messages, createdUser, setEmail, setFirstName, setLastName, setImageUrl, setUser, setUsers, setMessages, 
		imageContent, setImageContent, setCreatedUser, login, logout, handleUser, handleCreateUser, handleAllUsers, handlePosts, handleAllUpdateUser,
		handleUpdateUser, handleDestroyUser, loading, error };
}
