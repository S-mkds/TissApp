<script>
import CustomSpinner from '../components/spinner.vue'
import Swal from 'sweetalert2'
import moment from 'moment'
export default {
    components: { CustomSpinner },
    data() {
        return {
            showSpinner: false, //Spinner
            search: '', //Search user-
            setOneUser: {}, //GetOneUser
            setAllPosts: [], //GetAllPost
            content: '', //PUT Msge
            setPostContent: '', // PostMsge
            errorMessage: '', //Text Err Msge
        }
    },
    methods: {
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
        // EDIT POST
        async editPost(userId, content) {
            try {
                const data = await fetch(`http://localhost:3100/api/posts/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        content: content,
                    })
                });
                const response = await data.json();
                console.log("success edit post")
                console.log(response);
                this.getPosts();
            } catch (error) {
                console.log("catch edit post")
                console.log(error);
                this.errorMessage = error.message;
            }
        },

        async deletePost(userId) {
            try {
                const data = await fetch(`http://localhost:3100/api/posts/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const response = await data.json();
                console.log("success delete posts")
                console.log(response);
                this.getPosts();
            } catch (error) {
                console.log("catch delete posts")
                console.log(error);
                this.errorMessage = error.message;
            }
        },

        async getPosts() {
            try {
                const response = await fetch(`http://localhost:3100/api/posts`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
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

        async sendPosts() {
            try {
                const response = await fetch(`http://localhost:3100/api/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        content: this.setPostContent
                    })
                });
                const data = await response.json();
                console.log(data);
                console.log("success POST MSGE");
            } catch (error) {
                console.log(error);
                console.log("catch POST MSGE");
            }
        },

        adminPanel() {
            setTimeout(() => {
                this.showSpinner = false;
                this.$router.push({ path: '/admin' });
            }, 1000);
        },

        userPanel() {
            setTimeout(() => {
                this.showSpinner = false;
                this.$router.push({ path: '/admin-user' });
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

        // EDIT POST
        confirmEdit(userId) {
            Swal.fire({
                title: 'Modifier un message !',
                html: `
                        <input id="swal-input1" class="swal2-input" placeholder="Message">
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
                    ]
                }
            }).then((result) => {
                if (result.value) {
                    if (result.value[0] === '') {
                        Swal.fire({
                            title: 'Erreur!',
                            text: 'Vous ne pouvez pas envoyez un message vide!',
                            icon: 'error',
                            color: '#fff',
                            background: '#0F1828',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        })
                    } else {
                        this.editPost(userId, result.value[0]);
                    }
                }
            })
        },
        // DELETE POST
        confirmDelete(userId) {
            Swal.fire({
                title: "Êtes-vous sûr de vouloir supprimer ce message?",
                text: "Cette action est irréversible!",
                icon: 'warning',
                showCancelButton: true,
                color: '#fff',
                background: '#0F1828',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, supprimer!',
                cancelButtonText: 'Annuler'
            }).then((result) => {
                if (result.value) {
                    this.deletePost(userId);
                }
            })
        },

        // SEND POST
        ModalSend() {
            if (!this.setPostContent) {
                Swal.fire({
                    title: 'Erreur!',
                    text: 'Le champ de message est vide, veuillez entrer un message avant de l\'envoyer.',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    background: '#0F1828',
                    color: '#fff',
                    confirmButtonText: 'Ok'
                });
                return;
            }
            Swal.fire({
                title: 'Message envoyé!',
                text: 'Votre message a bien été envoyé',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                background: '#0F1828',
                color: '#fff',
                confirmButtonText: 'Ok'
            })
                .then((result) => {
                    if (result.value) {
                        this.sendPosts();
                        setTimeout(function () {
                            window.location.reload(true)
                        }, 200)
                    }
                    else {
                        Swal.fire({
                            title: 'Erreur!',
                            text: 'Une erreur est survenue lors l\'envoi de la requête!',
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
    mounted() {
        this.$lightModeConfig.initializeLightMode();
    },
    created() {
        this.getPosts()
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
}
</script>
<template>
    <section class="main-container">
        <!-- HEADER -->
        <header class="header">
            <img @click="adminPanel(); showSpinner = true" class="logo-h" src="~/static/NewLogo.png" alt="Logo-h" />
            <h1 class="w-text h-text">TISSAPP Admin panel
                <p class="text-danger">Administrateur: {{ setOneUser.firstName }} {{
                    setOneUser.lastName }}</p>
            </h1>
            <div class="button-header">
                <!-- user button -->
                <button id="user-button" @click="userPanel(); showSpinner = true">Utilisateurs</button>
                <!-- logout button -->
                <button id="logout-button" @click="logout(); showSpinner = true">Déconnexion</button>
                <!-- spinner -->
                <custom-spinner v-if="showSpinner"></custom-spinner>
            </div>
        </header>
        <!-- MAIN -->
        <div class="container-table">
            <div class="overflow-auto post-container" style="max-height: 700px">
                <h1 class="w-text title ">Chat Administration</h1>
                <!-- TABLE USER -->
                <table class="table">
                    <thead>
                        <tr>
                            <th class="w-text">ID</th>
                            <th class="w-text">Nom d'utilisateur</th>
                            <th class="w-text">Image</th>
                            <th class="w-text">Message</th>
                            <th class="w-text">Date de création</th>
                            <th class="w-text">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- POST DATA -->
                        <tr v-for="post in setAllPosts" :key="post.id">
                            <td class="w-text">{{ post.id }}</td>
                            <td class="w-text">{{ post.User.firstName }} {{ post.User.lastName }} <p class="w-text">{{
                                post.User.email
                            }}</p>
                            </td>
                            <td class="w-text">
                                <img class="img-post" :src="post.imageUrl">
                            </td>
                            <td class="w-text" id="td-msge">{{ post.content }}</td>
                            <td class="w-text">{{ formatDate(post.createdAt) }}</td>
                            <td>
                                <!-- EDIT USER -->
                                <!-- <button class="btn btn-primary" @click="confirmEdit(post.id)">Modifier</button> -->
                                <!-- DELETE USER -->
                                <button class="btn btn-danger" @click="confirmDelete(post.id)">Supprimer</button>
                                <!-- MSGE ERROR -->
                                <p class="error-text">{{ errorMessage }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <section class="section-send">
            <div>
                <form class="send-message">
                    <input v-model="setPostContent" type="text" class="input-send w-text"
                        placeholder="Envoyez votre message..." />
                    <button class="btn-send" type="submit" @click.prevent="ModalSend()">Envoyer</button>
                </form>
            </div>
        </section>
    </section>
</template>

<style scoped>
.main-container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 120vh;
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

.img-post {
    width: 100px;
    max-height: 100px;
    margin: 10px;
    opacity: 1;
    display: block;
    cursor: pointer;
    border-radius: 20%;
}

#td-msge {
    max-width: 250px;
    overflow-x: auto;
    word-wrap: break-word;
}

.form-group {
    display: flex;
    flex-direction: column;
    width: 20%;
    width: 95%;
}

.table {
    width: 100%;
    color: white;
    font-size: 1rem;
    font-weight: 600;
}

.container-table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.post-container {
    border: 2px solid #0F1828;
    border-radius: 20px;
    margin: 1rem;
    width: 90%;
    min-width: 300px;
    text-align: center;
}

td,
th {
    border-bottom: 2px solid #0F1828;
    border-right: 2px solid #0F1828;
    border-radius: 20px;
}


.h-text {
    padding-top: 20px;
    font-size: 1.5rem;
    font-weight: 600;
}

.title {
    font-size: 2rem;
    font-weight: 600;
    justify-content: center;
    padding: 15px;
    text-align: center;
}

.w-text {
    color: white;
    font-size: 1rem;
    font-weight: 600;
}

.text-sucess {
    color: green;
    font-weight: 600;
}

.text-info {
    color: rgb(52, 124, 233);
    font-weight: 600;
}

/* .text-danger {
    color: red !important;
    font-weight: 600;
} */

.send-message {
    display: flex;
    align-items: center;
    padding: 5px;
    width: 35%;
    height: 100%;
    margin-left: 1.5rem;
}

.input-send {
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid rgb(54, 55, 55);
    background-color: rgb(157, 159, 159);
    font-size: 1rem;
    font-weight: 600;
    margin: 5px;
}

.btn-send {
    color: white;
    background-color: #5f18eb;
    /* background-image: linear-gradient(80deg, #3b1c6d, #2ca087); */
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    border-radius: 5px;
}

.btn-send:hover {
    background-color: #5f18eb;
    opacity: 0.8;
}

.section-send {
    padding-bottom: 2rem;
}
</style>