<script>
import CustomSpinner from '../components/spinner.vue'
import Swal from 'sweetalert2'
export default {
    components: { CustomSpinner },

    data() {
        return {
            showSpinner: false, //Spinner
            showModal: false, //
            setOneUser: {}, //GetOneUser
            setAllUsers: [], //GetAllUser
            lastFourUsers: [],// Get 4 last users
            setAllPosts: [], //GetAllPost
            lastFourPosts: [],// Get 4 last messages
            totalUsers: 0, //Count nb users
            totalPosts: 0, //Count nb Posts
            errorMessage: '', //Text Err Msge
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
                const data = await fetch(`http://localhost:3100/api/auth/users?search=`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const response = await data.json();
                this.setAllUsers = response.users;
                this.totalUsers = this.setAllUsers.length;
                this.lastFourUsers = this.setAllUsers.slice(-4).reverse();
                console.log(response);
                console.log("success get all user");
            } catch (error) {
                console.log(error);
                console.log("catch get all user");
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
                this.totalPosts = this.setAllPosts.length;
                this.lastFourPosts = this.setAllPosts.reverse().slice(-4).reverse();
                console.log("success get all posts");
            } catch (error) {
                console.log(error);
                console.log("catch get all posts");
            }
        },

        // user PANEL
        userPanel() {
            setTimeout(() => {
                this.showSpinner = false;
                this.$router.push({ path: '/admin-user' });
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
    },
    mounted() {
        this.$lightModeConfig.initializeLightMode();
    },
    // CREATED
    created() {
        this.getPosts()
        this.getUsers()
        //Decode token and get user connected
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            const token = localStorage.getItem('token');
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.userId;
            this.getOneUser(userId);
        }
    },
}
</script>
<template>
    <section class="main-container">
        <!-- HEADER -->
        <header class="header">
            <img class="logo-h" src="~/static/NewLogo.png" alt="Logo-h" />
            <h2 class="h-text title">TISSAPP Admin panel
            </h2>
            <div>
                <h2 class="title-admin">Administrateur: {{ setOneUser.firstName }} {{ setOneUser.lastName }}</h2>
            </div>
            <div class="button-header">
                <!-- user button -->
                <button id="user-button" @click="userPanel(); showSpinner = true">Utilisateurs</button>
                <!-- chat button -->
                <button id="chat-button" @click="chatPanel(); showSpinner = true">Chat</button>
                <!-- logout button -->
                <button id="logout-button" @click="logout(); showSpinner = true">Déconnexion</button>
                <!-- spinner -->
                <custom-spinner v-if="showSpinner"></custom-spinner>
            </div>
        </header>
        <!-- first square -->
        <div class="container">
            <div class="container-square-left">
                <div class="square-user">
                    <h4 class="number-context">Nombre d'utilisateurs: </h4>
                    <br>
                    <p class="number-context" style="text-align: center; font-size: 20px;">
                        {{ totalUsers }}
                    </p>
                </div>
            </div>
            <div class="container-square">
                <div class="square">
                    <h4 class="title-context">Nouveau utilisateur: </h4>
                    <div class="context" v-for="users in lastFourUsers" :key="users._id">
                        {{ users.email }} -
                        {{ users.firstName }}
                        {{ users.lastName }}
                    </div>
                </div>
            </div>
            <div class="container-square-left">
                <div class="square-post">
                    <h4 class="number-context">Nombre de messages: </h4>
                    <br>
                    <p class="number-context" style="text-align: center; font-size: 20px;">
                        {{ totalPosts }}
                    </p>
                </div>
            </div>
            <div class="container-square">
                <div class="square">
                    <h4 class="title-context">Nouveau message:</h4>
                    <div class="context" v-for="post in lastFourPosts" :key="post._id">
                        <p style="text-align: center;">
                            {{ post.User.email }} -
                            {{ post.User.firstName }}
                            {{ post.User.lastName }}
                        </p>
                        <br>
                        {{ post.content }}
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<style scoped>
.main-container {
    display: flex;
}

/* HEADER */
.header {
    background-color: #71717176;
    border: 2px, solid, #0F1828;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    height: 100vh;
}

.logo-h {
    display: flex;
    width: 100px;
    height: 100px;
    opacity: 1;
    margin: auto;
    margin-top: 50%;
}


.button-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 20%;
}

#logout-button {
    color: white;
    background-color: rgba(219, 15, 15, 0.699);
    background-image: linear-gradient(120deg, #fd3737, #813c2796);
    padding: 10px 15px;
    font-size: 1rem;
    margin: 20px;
    border-radius: 5px;
    width: 150px;
    border: 1px solid #813c2796;
}

#logout-button:hover {
    background-color: rgb(79, 25, 25);
    opacity: 0.8;
    cursor: pointer;
}

#chat-button,
#user-button {
    color: white;
    background-image: linear-gradient(120deg, #136bef, #0d3b8adb);
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    margin: 20px;
    border-radius: 5px;
    width: 150px;
    border: 1px solid #813c2796;
}

#chat-button:hover,
#user-button:hover {
    background-color: rgb(48, 74, 112);
    opacity: 0.8;
    cursor: pointer;
}

.h-text {
    padding-top: 20px;
    font-size: 1.5rem;
}

.w-text {
    color: white;
}

.text-sucess {
    color: green;
}

.text-info {
    color: rgb(52, 124, 233);
}

.title {
    justify-content: center;
    font-size: 1.2rem;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.title-admin {
    color: rgba(255, 0, 0, 0.626) !important;
    justify-content: center;
    font-size: 1rem;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 10%;
}

/* BODY */
.container {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(2, 2fr);
}

.container-square {
    max-width: 100%;
}

.container-square-left {
    max-width: 55%;
}

.square-user {
    background-color: #242323;
    background-image: linear-gradient(to right, #872806c3, #e80c0ce1);
    border: 1px solid rgb(46, 42, 42);
    border-radius: 5%;
    opacity: 0.9;
    padding: 1rem;
    margin: 10px;
    overflow-y: auto;
    word-wrap: break-word;
    word-break: break-all;
    max-height: 35vh;
    min-height: 10vh;
    transition: all 0.5s;
    font-size: small;
}

.square-post {
    background-color: #242323;
    background-image: linear-gradient(to right, #0d429d, #1b4d4d);
    border: 1px solid rgb(46, 42, 42);
    border-radius: 5%;
    opacity: 0.9;
    padding: 1rem;
    margin: 10px;
    overflow-y: auto;
    word-wrap: break-word;
    word-break: break-all;
    max-height: 25vh;
    min-height: 10vh;
    transition: all 0.5s;
    font-size: small;
}

.square {
    background-color: #242323;
    background-image: linear-gradient(to right, #6e9a9ab7, #128d8d);
    border: 1px solid rgb(46, 42, 42);
    border-radius: 5%;
    opacity: 0.9;
    padding: 1rem;
    margin: 10px;
    overflow-y: auto;
    word-wrap: break-word;
    word-break: break-all;
    max-height: 40vh;
    min-height: 10vh;
    transition: all 0.5s;
    font-size: small;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
}

.container-square-left::-webkit-scrollbar {
    width: 8px;
}

.container-square-left::-webkit-scrollbar-thumb {
    background-color: transparent;
}

.container-square-left::-webkit-scrollbar-track {
    background-color: transparent;
}


.title-context {
    justify-content: center;
    font-size: 1.2rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: rgba(230, 6, 6, 0.914) !important;
}

.title-context-user {
    font-size: 1rem;
    padding: 0;
    margin-bottom: -10px;
    align-self: center;
}

.number-context {
    color: white !important;
}

.context {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin: 10px;
    padding: 5px;
    color: white;
    border: 2px solid rgb(46, 42, 42);
    border-radius: 5px;
    background-color: #24232363;
    opacity: 1;
    transition: all 0.5s;
}
</style>