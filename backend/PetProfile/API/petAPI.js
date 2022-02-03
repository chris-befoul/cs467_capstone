const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})
const upload = multer({ dest: 'uploads/' });
const directory = 'uploads';
const router = express.Router();
router.use(bodyParser.json());

const petFunctions = require('../petHelperFunctions/petFunctions');
const petPhotoFunction = require('../petHelperFunctions/petPhoto');

router.get('/:petID', function(req, res) {
    petFunctions.get_pet(req.params.petID).then(pet => {
        if (pet[0] === undefined || pet[0] === null) {
            res.status(404).json({ 'Error': 'No pet with this petID exists' });
            return;
        }
        else {
            res.status(200).json(pet[0]);
            return;
        }
    })
})

router.patch('/:petID', function(req,res) {
    console.log(req.body);
    // const data = JSON.parse(req.body.data);
    // petFunctions.edit_pet(req.params.petID, data.name, data.type, data.breed, data.availability, data.sex, data.age, data.weight, data.disposition, data.description, data.shelter_id)
    //     .then( key => { res.status(200).send(key) });
    // return;
})

router.post('/createPetProfile', upload.array('file'), (req, res) => {
    const data = JSON.parse(req.body.data);
    if (!req.files) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    petFunctions.post_pet(data.name, data.type, data.breed, data.availability, data.sex, data.age, data.weight, data.disposition, data.description, data.shelter_id).then(key => {
                for (var x = 0; x < req.files.length; x++) {
                    const fileName = key.id + '/' + (x + 1);
                    petPhotoFunction.uploadPhoto(req.files[x].path, fileName);
                }
                fs.readdir(directory, (err, files) => {
                    if (err) throw err;
                  
                    for (const file of files) {
                      fs.unlink(path.join(directory, file), err => {
                        if (err) throw err;
                      });
                    }
                  });
                res.status(201).send(key);
                return;
    })
    return;
})

module.exports = router;