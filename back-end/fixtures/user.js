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
        // firstName: randomName.split(" ")[0],
        // lastName: randomName.split(" ")[1],
        firstName: 'John',
        lastName: 'Doe',
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