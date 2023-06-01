
<script>
import CustomSpinner from '../components/spinner.vue'
export default {
    components: { CustomSpinner },
    data() {
        return {
            showSpinner: false, //Spinner
            email: '',
            password: '',
            errorMessage: '',
            isPasswordVisible: false,
            mounted() {
                this.getUsers()
            }
        }
    },
    methods: {
        async submitLogin() {
            const data = {
                email: this.email,
                password: this.password
            };
            await fetch('http://localhost:3100/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(res => {
                    if (res.user.admin === true) {
                        console.log(res);
                        console.log(res.user);
                        localStorage.setItem('token', res.token);
                        this.showSpinner = true;
                        setTimeout(() => {
                            this.showSpinner = false;
                            this.$router.push({ path: '/admin' });
                        }, 1000);
                        console.log("sucess login");
                    } else {
                        this.errorMessage = "Vous n'êtes pas un administrateur";
                        console.log("not admin");
                    }
                })
                .catch(err => {
                    this.errorMessage = "Email ou mot de passe incorrect";
                    console.log(err);
                });
        },
        togglePasswordVisibility() {
            this.isPasswordVisible = !this.isPasswordVisible;
            const input = document.getElementById("password");
            input.type = this.isPasswordVisible ? "text" : "password";
        },
        indexPanel() {
            this.showSpinner = false;
            setTimeout(() => {
                this.showSpinner = true;
                this.$router.push({ path: '/' });
            }, 1000);
        },
    },
}
</script>

<template>
    <section>
        <div>
            <form class="login-form">
                <img class="logo-img" src="~/static/NewLogo.png" alt="Logo" @click="indexPanel(); showSpinner = true" />
                <h1 class="w-text login-text">Connexion Administration</h1>
                <label class="w-text label-text" for="email">Email :</label>
                <input class="input-text" id="email" type="email" v-model="email" placeholder="Entrez votre Email Admin" />
                <label class="w-text label-text" for="password">Mot de passe :</label>
                <input class="input-text" id="password" type="password" v-model="password"
                    placeholder="Entrez votre mot de passe" />
                <button class="toggle-password" @click="togglePasswordVisibility" type="button">
                    <i class="fas fa-eye"></i>
                </button>
                <!-- Login Button -->
                <button class="button1" @click.prevent="submitLogin(); showSpinner = true">Connexion</button>
                <!-- spinner -->
                <custom-spinner v-if="showSpinner"></custom-spinner>
                <p class=" error-text">{{ errorMessage }}</p>
            </form>
        </div>
    </section>
</template>

<style scoped>
.h-text {
    font-size: 1.5rem;
    font-weight: 600;
    justify-content: center;
    font-family: 'Times New Roman', Times, serif;
}

.w-text {
    color: white;
}

.logo-img {
    width: 100px;
    height: 100px;
    margin-right: 5px;
    opacity: 1;
    object-fit: contain;
    display: block;
    margin: 0;
    padding: 0;
    cursor: pointer;
}

.login-text {
    font-size: 1.5rem;
    font-weight: 600;
    justify-content: center;
}

.label-text {
    float: left;
    font-size: 1rem;
    font-weight: 600;
    justify-content: center;
}

.input-text {
    width: 80%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
    width: 500px;
    height: 500px;
    padding: 2rem;
    margin-top: 100px;
    top: 5rem;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.button1 {
    background-color: #FF6B6B;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
    width: 100px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    justify-content: center;
    width: 60%;
}

.button1:hover {
    background-color: #FF6B6B;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
    width: 100px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 200;
    justify-content: center;
    width: 60%;
    opacity: 0.8;
}

.error-text {
    color: red;
    font-size: 0.8rem;
    font-weight: 200;
    justify-content: center;
    padding: 5px;
}
</style>