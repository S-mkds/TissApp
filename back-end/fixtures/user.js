// Création de mes fixtures pour l'utilsateurs en base de donnnée

// const users = [
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.fra', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frb', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frc', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frd', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.fre', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frf', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frg', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frh', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.fri', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frj', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frk', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frn', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frm', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.fro', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frp', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frq', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frr', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frs', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frt', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.fry', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frw', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frz', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.fraa', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frbb', password: 'Password123!' },
//     { firstName: 'Bob', lastName: 'Smith', email: 'bobsmith@example.frcc', password: 'Password123!' },

//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.fra', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frb', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frc', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frd', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.fre', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frf', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frg', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frh', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.fri', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frj', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frk', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frn', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frm', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.fro', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frp', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frq', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frr', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frs', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frt', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.fry', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frw', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frz', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.fraa', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frbb', password: 'Password123!' },
//     { firstName: 'John', lastName: 'Doe', email: 'JohnDoe@example.frcc', password: 'Password123!' },
//   ];
//   for (let i = 0; i < users.length; i++) {
//     const user = users[i];
//     db.User.create(user)
//       .then((createdUser) => {
//         console.log(`User ${createdUser.firstName} ${createdUser.lastName} created successfully.`);
//       })
//       .catch((error) => {
//         console.log(`Error creating user ${user.firstName} ${user.lastName}`, error);
//       });
//   }



// Création de ma boucle pour push des utilisateurs dans la base de donnée
const imageUrls = [
    'https://picsum.photos/200',
    'https://picsum.photos/200',
    'https://picsum.photos/200',
    // add more image URLs here
];
const users = [];
for (let i = 0; i < 100; i++) {
        const randomName = `${Math.random().toString(36).substring(7)} ${Math.random().toString(36).substring(7)}`;
        const randomEmail = `John-Doe${Math.floor(Math.random() * 100000)}@gmail.com`;
        const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        const user = {
        firstName: randomName.split(" ")[0],
        lastName: randomName.split(" ")[1],
        email: randomEmail,
        password: 'Password123!',
        imageUrl: randomImageUrl
        };
        db.User.create(user)
        .then((createdUser) => {
            console.log(`User ${createdUser.firstName} ${createdUser.lastName} created successfully.`);
        })
        .catch((error) => {
            console.log(`Error creating user ${user.firstName} ${user.lastName}`, error);
        });
}