// --- NPM packs
const express = require('express');

const mongoose = require("mongoose");
const https = require('https')
const axios = require('axios');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('req-flash');
const passport = require('passport');
const app = express();

// --- Mongo Connection
mongoose.connect(
    "mongodb+srv://code4all:code4all@cluster0.kin8f.mongodb.net/livraria?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

app.use(
    cors({
        origin: 'http://localhost:4001',
        credentials: true
    })
)

app.use(express.json());

app.set('trust proxy', 1);

app.use(
    session({
        cookie: process.env.DEVELOPMENT
            ? null
            : {
                secure: true,
                sameSite: 'none',
                maxAge: 4 * 60 * 60 * 1000
            },
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: process.env.PORT
            ? MongoStore.create(
                {
                    mongoUrl: "mongodb+srv://code4all:code4all@cluster0.kin8f.mongodb.net/livraria?retryWrites=true&w=majority",
                },
                (err, resposta) => {
                    console.log(err || resposta)
                }
            )
            : null
    })
)

app.use(passport.initialize())
app.use(passport.session())

// --- Collections
const Branch = require('./models/Branches');
const User = require('./models/Users');
const { json } = require('express');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// --- Rotas

let defaultBook = {
    nome: { type: String, required: [true, 'o nome é obrigatório!'] },
    price: { type: Number, required: [true, 'o preço é obrigatório!'] },
    category: {
        type: String,
        required: [true, 'categoria é obrigatória!'],
        enum: ['Romance', 'Sci-fi', 'Terror', 'Científico', 'Diversos'],
        default: 'Diversos'
    },
}

let BooksSchema = new mongoose.Schema(defaultBook)
const Book = mongoose.model('Book', BooksSchema)
app.get(
    '/clock',
    (req, res) => {
        const timeNow = new Date();
        res.send(timeNow)
    }
);
const url = 'https://api.kanye.rest/'

app.get('/kanyeAxios', (req, res) => {
    axios.get(url).then((response) => {
        res.send(response.data.quote)
    })
})

app.get('/kanyeHttps', (req, res) => {
    https.get(url, (response) => {
        console.log(response.statusCode);
        response.on('data', (data) => {
            const kanyeData = JSON.parse(data)
            res.send(kanyeData);
        })

        new Promise((resolve, reject) => {
            const url = 'https://api.kanye.rest'
            resolve(fetch(url))

        })

            .then(valor => valor.json())
            .then(quote => quote.quote.toUpperCase())
            .then(console.log)
            .catch(console.error)
    })
})

/* let firstFilial = new Branch({
    cnpj: 123456789,
    address: 'Rua X, cidade Y, Estado Z',
    zipCode: 22670150,
    important: true,
    manager: null,
    employees: [null]
})
firstFilial.save((err, savedObject) => {
    if (err) {
        console.log(err)
    }
    else {console.log('sucesso!') }
}) */
/* let secondFilial = Branch.create({
    cnpj: 987654321,
    address: 'Rua JK, BH, MG',
    zipCode:12312130,   
}) */

/* let firtsCliente = User.create({
    name: 'Matheus Garcia ',
    cpf: 11222345,
    branch: '6410fe48bba78db1d17ea940',
    manager: true
}) */

app.get('/find', (req, res) => {
    let procurarPorCnpj = req.query.cnpj;
    Branch.find(
        { cnpj: procurarPorCnpj },
        (err, achado) => {
            if (err) {
                res.send(false)
            } else {
                res.send(achado)
            }
        }
    )
})
app.get('/find/:idt', (req, res) => {
    let personID = req.params.idt;
    User.findById(personID,
        (err, foundUser) => {
            if (err) {
                res.send(false)
            } else {
                /* nesse momento, o server vai encontrar o usário e vai salvar
                no objeto FOUND
                let found = { name: ,  cpf: , branch: , manager:,  type: , } */
                Branch.findById(
                    foundUser.branch,
                    (err2, foundBranch) => {
                        if (err) {
                            res.send(false)
                        } else {
                            res.send(foundBranch)
                        }
                    }
                )
            }
        })
})

function criptografar(palavra) {
    let n = palavra.length;
    let n2 = parseInt(n / 2);
    let n4 = parseInt(n2 / 2)
    //return `a palavra tem ${n} letras e a posição central é ${n2}`

    let newPalavra = `${palavra.slice(n4, n2)}-${n * n * n}-${palavra.slice(n2)}`
    return `a palavra criptografa é: ${newPalavra}`
}

app.get('/testeCript', (req, res) => {
    res.send(criptografar(req.query.palavra))
})

app.get('/createUser', (req, res) => {

    User.register({
        name: req.query.name,
        cpf: req.query.cpf,
        branch: req.query.branch,
        manager: req.query.manager,
    },
        req.query.password,
        (err, saved) => {
            if (err) {
                console.log(err)
            } else if (!saved) {
                res.send({ status: false, msg: 'Erro no cadastro' })
            } else {
                res.send({
                    status: true,
                    msg: 'usuário cadastrado com sucesso!',
                    data: saved
                })
            }
        })
})

app.get('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            console.log(err)
        } else if (!user) {
            res.send({
                status: false,
                msg: 'Erro no login'
            })
        } else {
            req.logIn(user, (err2, user2) => {
                if (err2) {
                    console.log(err2)
                } else if (!user2) {
                    res.send({
                        status: false,
                        msg: 'Erro no login'
                    })
                } else {
                    res.send({
                        status: true,
                        msg: 'usuário cadastrado com sucesso!',
                        data: req.user
                    })
                }
            })
        }
    })(req, res, next)
})
app.get('/updateuser2', (req, res) => {

    console.log(req.query)

    User.findById(req.query.idt, (err, found) => {
        if (err) {
            console.log({ status: false, mensagem: `Erro ao buscar user` })
        } else if (!found) {
            console.log({ status: false, mensagem: `Usuário não encontrado` })
        } else {
            console.log({ status: true, mensagem: `Usuário encontrado` })
        }
    })

    User.findByIdAndUpdate(req.query.idt, { name: req.query.name }, { multi: true }, (err, updated) => {
        if (err) {
            console.log(err);
            res.send({ status: false, mensagem: "Erro ao atualizar usuário" })
        } else {

            res.send({ status: true, mensagem: `Usuário atualizado com sucesso. Agora suas props são ${updated}` })
        }
    }

    )
})

app.get('/updateUser', (req, res) => {
    if (req.isAuthenticated()) {
        User.findByIdAndUpdate(
            found._id,
            {
                name: req.query.name,
                cpf: req.query.cpf,
                branch: req.query.branch,
                manager: req.query.manager,
            },
            { multi: true },
            function (err, userUpdated) {
                if (err) {
                    console.log("O usuário não foi atualizado");
                    res.send({
                        erro: true,
                        mensagem: 'Usuário não atualizado',
                    });
                } else {
                    if (req.body.password) {
                        userUpdated.setPassword(
                            req.body.password,
                            (err, userUpdated) => {
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        erro: true,
                                        mensagem: 'Erro ao atualizar a senha',
                                    });
                                } else {
                                    userUpdated.save();
                                    res.send(userUpdated);
                                    console.log(
                                        "O Usuário e senha foram atualizados com Sucesso!!"
                                    );
                                }
                            }
                        );
                    } else {
                        res.send(userUpdated);
                        console.log(
                            "O Usuário foi atualizado com Sucesso!!"
                        );
                    }
                }
            }
        )
    } else {
        res.send(
            {
                status: false,
                msg: "user not authenticated",
                route: '/login' // -> if(!res.data.status) { window.location(req.data.route)}
            }
        )
    }

})




app.listen(4000,
    () => {
        console.log('A livraria está aberta!') //the server is up and running! 
    })