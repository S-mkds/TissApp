<script>
import CustomSpinner from '../components/spinner.vue'
import Swal from 'sweetalert2'
import moment from 'moment'
export default {
    components: { CustomSpinner },

    data() {
        return {
            showSpinner: false, //Spinner
            showModal: false, // modal
            search: '', //Search user
            firstName: '', //PUT USER
            lastName: '', //PUT USER
            email: '',  //PUT USER
            setOneUser: {}, //GetOneUser
            setAllUsers: [], //GetAllUser
            setAllPosts: [], //GetAllPost
            totalUsers: 0, //Count nb user
            errorMessage: '', //Text Err Msge
            isOnline: false // Status online
        }
    },
    methods: {
        // REQUEST GET ONE USER
        async getOneUser(userId) {
            try {
                const data = await fetch(`http://localhost:3100/api/auth/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const response = await data.json();
                this.setOneUser = response.user;
                console.log(response);
                console.log("success get one user");
            } catch (error) {
                console.log(error);
                console.log("catch get one user");
            }
        },

        // REQUEST GET ALL USER
        async getUsers() {
            try {
                const data = await fetch(`http://localhost:3100/api/auth/users?search=${this.search}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const response = await data.json();
                this.setAllUsers = response.users;
                this.totalUsers = this.setAllUsers.length;
                console.log(response);
                console.log("success get all user");
            } catch (error) {
                console.log(error);
                console.log("catch get all user");
            }
        },

        // REQUEST PUT USER
        async editUser(userId, email, firstName, lastName) {
            try {
                const data = await fetch(`http://localhost:3100/api/auth/edit-admin/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                    })
                });
                const response = await data.json();
                console.log("success edit user")
                console.log(response);
                this.getUsers();
            } catch (error) {
                console.log("catch edit user")
                console.log(error);
                this.errorMessage = error.message;
            }
        },

        // REQUEST DELETE USER
        async deleteUser(userId) {
            try {
                const data = await fetch(`http://localhost:3100/api/auth/users-delete/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const response = await data.json();
                console.log("success delete user")
                console.log(response);
                this.getUsers();
            } catch (error) {
                console.log("catch delete user")
                console.log(error);
                this.errorMessage = error.message;
            }
        },

        // GET ALL POSTS
        async getPosts() {
            try {
                const response = await fetch(`http://localhost:3100/api/posts`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                console.log(data);
                this.setAllPosts = data.posts;
                console.log("success get all posts");
            } catch (error) {
                console.log(error);
                console.log("catch get all posts");
            }
        },

        // ADMIN PANEL
        adminPanel() {
            setTimeout(() => {
                this.showSpinner = false;
                this.$router.push({ path: '/admin' });
            }, 1000);
        },

        // CHAT PANEL
        chatPanel() {
            setTimeout(() => {
                this.showSpinner = false;
                this.$router.push({ path: '/admin-chat' });
            }, 1000);
        },

        // LOGOUT
        logout() {
            this.showSpinner = true;

            fetch(`http://localhost:3100/api/auth/edit`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    isOnline: false
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Success logout:", data);
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        this.showSpinner = false;
                        this.$router.push({ path: "/login" });
                    }, 1000);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        },
        // EDIT USER
        confirmEdit(userId) {
            Swal.fire({
                title: 'Modifier un utilisateur !',
                html: `
                        <input id="swal-input1" class="swal2-input" placeholder="Email">
                        <input id="swal-input2" class="swal2-input" placeholder="Prénom">
                        <input id="swal-input3" class="swal2-input" placeholder="Nom">
                    `,
                focusConfirm: false,
                showCancelButton: true,
                color: '#fff',
                background: '#0F1828',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, modifier!',
                cancelButtonText: 'Annuler',
                icon: 'info',
                preConfirm: () => {
                    return [
                        document.getElementById('swal-input1').value,
                        document.getElementById('swal-input2').value,
                        document.getElementById('swal-input3').value
                    ]
                }
            }).then((result) => {
                // le nom doit contenir entre 1 et 12 caractères, les caractères spéciaux autorisés sont éè'çà"-_
                const nameRegex = /^[a-zA-Zéè'çà"-_]{1,12}$/;
                //L'email doit contenir au moins un caractère, un @, un point, et au moins 2 caractères après le point.
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if (result.value) {
                    if (result.value[0] === '' || result.value[1] === '' || result.value[2] === '') {
                        Swal.fire({
                            title: 'Erreur!',
                            text: 'Veuillez remplir tous les champs',
                            icon: 'error',
                            color: '#fff',
                            background: '#0F1828',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        })
                    } else if (!emailRegex.test(result.value[0])) {
                        Swal.fire({
                            title: 'Erreur!',
                            text: 'Veuillez entrer un email valide.' + ' example@example.fr',
                            icon: 'error',
                            color: '#fff',
                            background: '#0F1828',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        })
                    } else if (!nameRegex.test(result.value[1]) || !nameRegex.test(result.value[2])) {
                        Swal.fire({
                            title: 'Erreur!',
                            text: 'Veuillez entrer un nom ou un prénom valide',
                            icon: 'error',
                            color: '#fff',
                            background: '#0F1828',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        })
                    } else {
                        this.editUser(userId, result.value[0], result.value[1], result.value[2]);
                    }
                }
            })
        },

        // DELETE USER
        confirmDelete(userId) {
            Swal.fire({
                title: "Êtes-vous sûr de vouloir supprimer cet utilisateur?",
                text: "Cette action est irréversible!",
                icon: 'warning',
                showCancelButton: true,
                color: '#fff',
                background: '#0F1828',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, supprimer!',
                cancelButtonText: 'Annuler'
            })
                .then((result) => {
                    if (result.value) {
                        this.deleteUser(userId);
                    }
                    // Si l'utilisateur a annulé, ne faites rien
                    else if (result.dismiss === Swal.DismissReason.cancel) {
                        return;
                    }
                    else {
                        Swal.fire({
                            title: 'Erreur!',
                            text: 'Une erreur est survenue lors de l\'envoi de la requête!',
                            icon: 'error',
                            color: '#fff',
                            background: '#0F1828',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        })
                    }
                })
        },
        // Formatage de la date
        formatDate(date) {
            return moment(date).locale('fr').format('dddd D MMMM, HH:mm:ss');
        },
    },

    // CREATED
    created() {
        this.getUsers()
        //Decode token and get user connected
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            const token = localStorage.getItem('token');
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.userId;
            this.getOneUser(userId);
        } else {
            console.log("Sorry, your browser does not support Web Storage...");
        }
    },
    mounted() {
        this.$lightModeConfig.initializeLightMode();
    },
}
</script>
<template>
    <section class="main-container">
        <!-- HEADER -->
        <header class="header">
            <img @click="adminPanel(); showSpinner = true" class="logo-h" src="~/static/NewLogo.png" alt="Logo-h" />
            <h1 class="w-text h-text">TISSAPP Admin panel
                <p class="text-danger" style="color: red !important;">Administrateur: {{ setOneUser.firstName }} {{
                    setOneUser.lastName }}</p>
            </h1>
            <div class="button-header">
                <!-- chat button -->
                <button id="chat-button" @click="chatPanel(); showSpinner = true">Chat</button>
                <!-- logout button -->
                <button id="logout-button" @click="logout(); showSpinner = true">Déconnexion</button>
                <!-- spinner -->
                <custom-spinner v-if="showSpinner"></custom-spinner>
            </div>
        </header>
        <!-- SEARCH USER -->
        <section class="user-list-section">
            <div class="form-group">
                <label class="w-text label-search" for="search">Rechercher un utilisateur</label>
                <input v-model="search" type="text" class="input-search" id="search"
                    placeholder="Entrer un nom d'utilisateur..." @input.prevent="getUsers" />
                <label class="w-text" for="totalUsers">Nombre d'utilisateurs total : {{ totalUsers }}</label>
            </div>
            <div class="overflow-auto user-container" style="max-height: 600px">
                <!-- TABLE USER -->
                <h1 class="w-text title ">Utilisateurs Administration</h1>
                <table class="table">
                    <thead>
                        <tr>
                            <th class="w-text">ID</th>
                            <th class="w-text">Avatar</th>
                            <th class="w-text">Nom d'utilisateur</th>
                            <th class="w-text">Email</th>
                            <th class="w-text">Rôle</th>
                            <th class="w-text">Date de création</th>
                            <th class="w-text">Status</th>
                            <th class="w-text">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- USER DATA -->
                        <tr v-for="user in setAllUsers" :key="user.id">
                            <td class="w-text">{{ user.id }}</td>
                            <td class="w-text">
                                <img class="img-user" :src="user.imageUrl">
                            </td>
                            <td class="w-text">{{ user.firstName }} {{ user.lastName }}</td>
                            <td class="w-text">{{ user.email }} </td>
                            <td>
                                <p class="text-sucess" v-if="user.admin === true">Administrateur</p>
                                <p class="text-info" v-if="user.admin === false">Utilisateur</p>
                            </td>
                            <td class="w-text">{{ formatDate(user.createdAt) }}</td>
                            <td class="bordered-cell">
                                <p class="text-sucess" v-if="user.isOnline === true">En-ligne 🟢</p>
                                <p class="text-danger" v-if="user.isOnline === false">Hors-ligne 🔴</p>
                            </td>
                            <td v-if="user.admin === false" class="bordered-cell">
                                <!-- EDIT USER -->
                                <button class="btn btn-primary" @click="confirmEdit(user.id)">Modifier</button>
                                <!-- DELETE USER -->
                                <button class="btn btn-danger" @click="confirmDelete(user.id)">Supprimer</button>
                                <!-- MSGE ERROR -->
                                <p class="error-text">{{ errorMessage }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </section>
</template>

<style scoped>
.main-container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.header {
    display: flex;
    background-color: #71717176;
    border: 2px, solid, #0F1828;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
}

.logo-h {
    width: 50px;
    height: 50px;
    margin: 10px;
    opacity: 1;
    object-fit: contain;
    display: block;
    cursor: pointer;
}

.button-header {
    display: flex;
    justify-content: flex-end;
    align-self: flex-end;
    margin-left: 45rem;
}


#logout-button {
    color: white;
    background-color: red;
    background-image: linear-gradient(120deg, #fd3737, #813c2796);
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    margin: 20px;
    border-radius: 5px;
}

#logout-button:hover {
    background-color: rgb(233, 52, 52);
    opacity: 0.8;
    cursor: pointer;
}

#chat-button,
#user-button {
    color: white;
    background-color: rgb(96, 52, 177);
    background-image: linear-gradient(120deg, #8637fd, #0f7074);
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    margin: 20px;
    border-radius: 5px;
    align-self: flex-end;
}

#chat-button:hover,
#user-button:hover {
    background-color: rgb(52, 124, 233);
    opacity: 0.8;
    cursor: pointer;
}

.input-search {
    width: 110%;
    height: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid rgb(54, 55, 55) !important;
    background-color: rgb(157, 159, 159) !important;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    margin: 5px;
}

.title {
    font-size: 2rem;
    font-weight: 600;
    justify-content: center;
    padding: 15px;
    text-align: center;
}

.form-group {
    display: flex;
    flex-direction: column;
    width: 20%;
    margin: 20px;
}

.table {
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 5rem;
}

td,
th {
    border-bottom: 2px solid rgb(102, 86, 86);
    text-align: center;
}

.user-container {
    border: 2px solid rgb(102, 86, 86);
    border-radius: 20px;
    padding: 0.2rem;
    margin: 1rem;
}

.h-text {
    padding-top: 20px;
    font-size: 1.5rem;
    font-weight: 600;
}

.label-search {
    float: left;
    font-size: 1rem;
    font-weight: 600;
    justify-content: center;
}

.w-text {
    color: white;
    font-size: 1rem;
    font-weight: 600;
}

.text-sucess {
    color: rgb(6, 158, 6) !important;
}

.text-info {
    color: rgb(5, 12, 107);
    font-weight: 900;
}

.text-danger {
    color: red !important;
    font-weight: 600;
}

.img-user {
    width: 100px;
    max-height: 100px;
    margin: 10px;
    opacity: 1;
    display: block;
    cursor: pointer;
    border-radius: 20%;
}

.user-list-section {
    padding-bottom: 2rem;
}
</style>