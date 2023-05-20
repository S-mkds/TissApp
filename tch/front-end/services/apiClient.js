

class ApiClient {
	constructor () {
		this.baseUrl = 'http://localhost:3000/';
	}

	headers(options = {}) {
		const contentType = options.isFormData
			? {}
			: {
				'Content-Type': 'application/json',
			};

		return {
			...contentType,
			Authorization: 'Bearer ' + localStorage.getItem('userToken'),
		};
	}

	async get(path) {
		try {
			const response = await fetch(this.baseUrl + path, {
				headers: this.headers(),
			});
			if (response.status === 401) {
				localStorage.clear();
				router.push({ name: 'Login' });
			}
			return await response.json();
		} catch {
			return alert("Impossible de récupérer les données de l'API");
		}
	}

	async post(path, body, options = {}) {
		const response = await fetch(this.baseUrl + path, {
			method: 'POST',
			body: options.isFormData ? body : JSON.stringify(body),
			headers: this.headers(options),
		});
		return await this.handleResponse(response);
	}

	async delete(path) {
		const response = await fetch(this.baseUrl + path, {
			method: 'DELETE',
			headers: this.headers(),
		});
		return await this.handleResponse(response);
	}

	async put(path, body, options = {}) {
		const response = await fetch(this.baseUrl + path, {
			method: 'PUT',
			body: options.isFormData ? body : JSON.stringify(body),
			headers: this.headers(options),
		});
		return await this.handleResponse(response);
	}

	async handleResponse(response) {
		if (!response.status.toString().match(/20[01]/))
			throw await response.json();
		return response.json();
	}
}

export const apiClient = new ApiClient();