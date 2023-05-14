const bcrypt = require('bcrypt');

function ensurePasswordIsStrongEnough(value) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,}$/;
  if (!value.match(regex)) {
    throw new Error(
      'Le mot de passe doit contenir au moins 8 caractères (dont au moins une majuscule, une minuscule, un chiffre, un caractère spécial).'
    );
  }
}

function addAuthenticationOn(User) {
  const encryptPassword = (user) => {
    if (user.changed('password')) {
      return bcrypt.hash(user.password, 10).then((hash) => {
        user.password = hash;
      });
    }
  };

  User.authenticate = async (email, password) => {
    const user = await User.findOne({ where: { email, deleted: false } });

    if (!user) {
      return { valid: false, message: 'Utilisateur non trouvé' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) return { valid: true, user };
    else return { valid: false, message: 'Mot de passe incorrect' };
  };

  User.beforeCreate(encryptPassword);
  User.beforeUpdate(encryptPassword);
}

module.exports = {
  ensurePasswordIsStrongEnough,
  addAuthenticationOn,
};
