const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

//indication de l'endroit où enregistrer les fichiers entrants et sous quel nom
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file);
    callback(null, 'public');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage: storage }).single('upload');
