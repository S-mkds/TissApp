<template>

    <div class="main-container">
        <header class="header">
            <img class="logo-h" src="~/static/NewLogo.png" alt="Logo-h" />
            <h1 class="w-text h-text">TISSAPP Admin panel</h1>
        </header>
        <section>
            <div>
                <form class="login-form" method="post" action="/admin">
                    <img class="logo-img" src="~/static/NewLogo.png" alt="Logo" />
                    <h1 class="w-text login-text">Connexion Administration</h1>
                    <label class="w-text label-text" for="email">Email :</label>
                    <input class="input-text" id="email" type="email" v-model="email"
                        placeholder="Entrez votre Email Admin" />
                    <label class="w-text label-text" for="password">Mot de passe :</label>
                    <input class="input-text" id="password" type="password" v-model="password"
                        placeholder="Entrez votre mot de passe" />
                    <button class="button1" @click="submitLogin">Connexion</button>
                </form>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {
        submitLogin() {
            // Code pour soumettre les données de connexion
        }
    }
}
</script>

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

.h-text {
    font-size: 1.5rem;
    font-weight: 600;
    justify-content: center;
    font-family: 'Sigmar One', cursive;
    text-shadow: 2px 2px 3px #7c7c7c;
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
}

.login-text {
    font-size: 1.5rem;
    font-weight: 600;
    justify-content: center;
    text-shadow: 2px 2px 3px #7c7c7c;
}

.label-text {
    float: left;
    font-size: 1rem;
    font-weight: 600;
    justify-content: center;
    text-shadow: 2px 2px 3px #7c7c7c;
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
    width: 400px;
    height: 400px;
    padding: 20px;
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
    text-shadow: 2px 2px 3px #7c7c7c;
    width: 60%;
}
</style>