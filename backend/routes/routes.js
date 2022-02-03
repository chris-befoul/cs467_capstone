const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Datastore} = require('@google-cloud/datastore');

const datastore = new Datastore();
const USER = 'User';

function fromDatastore(item) {
    item.id = item[Datastore.KEY].id;
    delete item["password"]
    return item;
}

function insertUser(new_user){
    var key = datastore.key(USER);
    return datastore.save({ "key": key, "data": new_user }).then(() => { return key });
} 

function getUsers () {
    const q = datastore.createQuery(USER);
    return datastore.runQuery(q).then((entities) => {
        return entities[0].map(fromDatastore);
    });
}

router.get('/', async(req, res) => {
    getUsers().then((users) => {res.status(200).json(users);});
});

router.post('/register', async(req, res) => {
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const new_user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code,
            email_preference: req.body.email_preference,
            type: req.body.type
        };
        insertUser(new_user).then(key => { res.status(201).send({"id": key.id, ...new_user}) });
    } catch {
        res.status(500).send();
    }
});

getQuery = async (email) => {
    const q = datastore.createQuery(USER).filter('email', '=', email);
    const [items] = await datastore.runQuery(q);
    item = items[0];
}
console.log(getQuery('betsmi@gmail.com'));

router.post('/login', async(req, res) => {
    const userItem = datastore.createQuery(USER).filter('email', '=', req.body.email);
    const [items] = await datastore.runQuery(userItem);
    let user = items[0];

    // console.log(user);
    // console.log(user[Datastore.KEY].id);

    if (!user) {
        return res.status(404).send({
            message: 'User not found!'
        });
    }
    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'Invalid password!'
        });
    }

    const token = jwt.sign({_id: user[Datastore.KEY].id}, "secret");

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.send({
        message: "success"
    });
});

router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];

        const claims = jwt.verify(cookie, 'secret');

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated!'
            });
        }

        const userItem = datastore.createQuery(USER);
        const [items] = await datastore.runQuery(userItem);
        let _user; 
        items.forEach(item => {
            if (item[Datastore.KEY].id == claims._id){
                _user = item;
            }
        })
        // console.log(_user);

        // const userItem = datastore.createQuery(USER).;
        // const userItem = datastore.createQuery(USER).filter('__key__', '=', datastore.key([USER, '5701666712059904']));
        // const [items] = await datastore.runQuery(userItem);
        // let _user = items.filter(item[Datastore.KEY].id === claims._id);
        // let _user = items[0];

        // const user = _user;
        const {password, ...data} = _user;

        // res.send(claims);
        res.send(data);
    } catch {
        return res.status(401).send({
            message: 'Unauthenticated!'
        });
    }
});

router.post('/logout', (req, res) => {
    // removing cookie
    res.cookie('jwt', '', {maxAge: 0});

    res.send({
        message: "Log out complete!"
    });
});

module.exports = router;