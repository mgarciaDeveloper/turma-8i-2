// --- NPM packs
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const https = require('https')
const axios = require('axios');

// --- Mongo Connection
mongoose.connect(
    "mongodb+srv://code4all:code4all@cluster0.kin8f.mongodb.net/livraria?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

// --- Collections
const Branch = require('./models/Branches');
const User = require('./models/Users');
const { json } = require('express');

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
    let password = req.query.password;



    let newObj = new User({
        name: req.query.name,
        cpf: req.query.cpf,
        branch: req.query.branch,
        manager: req.query.manager,

    })
    newObj.save((err, objSaved) => {
        if (err) {
            console.log(err);
            res.send(false)
        } else {
            res.send("Objeto criado com sucesso!")
        }
    })
})




app.listen(4000,
    () => {
        console.log('A livraria está aberta!') //the server is up and running! 
    })