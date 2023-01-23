<script>

export default {
    data() {
        return {
            search: '',
            users: [],
        }
    },
    methods: {
        async getUsers() {
            try {
                // const token = await this.$store.state.token
                const { data } = await axios.get('http://10.10.54.141:3100/api/users/', {
                    params: { search: this.search },
                    // headers: {
                    //     'Authorization': `Bearer ${token}`,
                    // },
                })
                this.users = data
            } catch (error) {
                console.log(error)
            }
        },
        editUser(id) {
            // implement edit user logic here
            console.log(`Editing user with ID: ${id}`)
        },
        banUser(id) {
            // implement ban user logic here
            console.log(`Banning user with ID: ${id}`)
        },
    },
    logout() {
        action = "/login"
        // Perform logout logic here
    }
}
</script>

<template>
    <section class="main-container">
        <header class="header">
            <img class="logo-h" src="~/static/NewLogo.png" alt="Logo-h" />
            <h1 class="w-text h-text">TISSAPP Admin panel</h1>
            <button id="logout-button" @click="logout" class="logout-button">Déconnexion</button>
        </header>

        <div>
            <div class="form-group">
                <label class="w-text label-text" for="search">Rechercher un utilisateur</label>
                <input v-model="search" type="text" class="form-control" id="search"
                    placeholder="Entrer un nom d'utilisateur" @input="getUsers" />
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th class="w-text">Nom d'utilisateur</th>
                        <th class="w-text">Date de création</th>
                        <th class="w-text">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user.id">
                        <td>{{ user.firstName }}</td>
                        <td>{{ user.createdAt }}</td>
                        <td>
                            <button class="btn btn-primary" @click="editUser(user.id)">Modifier</button>
                            <button class="btn btn-danger" @click="banUser(user.id)">Bannir</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped>
.main-container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #0F1828;
}

.header {
    display: flex;
    align-items: center;
    background-color: #423f3f54;
    opacity: 0.8;
    padding-left: 20rem;
}

.logo-h {
    width: 50px;
    height: 50px;
    margin: 10px;
    opacity: 1;
    object-fit: contain;
    display: block;
}

#logout-button {
    color: white;
    background-color: red;
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    margin-left: auto;
    margin-right: 20px;
}

.h-text {
    font-size: 1.5rem;
    font-weight: 600;
    justify-content: center;
    font-family: 'Sigmar One', cursive;
    text-shadow: 2px 2px 3px #7c7c7c;
}

.label-text {
    float: left;
    font-size: 1rem;
    font-weight: 600;
    justify-content: center;
    text-shadow: 2px 2px 3px #7c7c7c;
    margin-left: 20px;
}

.w-text {
    color: white;
}
</style>