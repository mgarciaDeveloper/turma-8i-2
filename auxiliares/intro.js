const express = require('express');
const app = express();

const romance = [
    {
        identificador: '123dfrts23qw',
        nome: 'Arrume sua cama', price: 45
    },
    { identificador: 'ghfter456723', nome: 'Orgulho e Preconceito', price: 70 },
    { identificador: '123dfrtdcrt3', nome: 'Cristianismo Puro e Simples', price: 67 },
]


app.get(
    '/cumprimento',
    (req, res) => {
        console.log(req.query)
        res.send('Hi there! Be welcome to Code_4all Class! ')
    });

app.get(
    '/clock',
    (req, res) => {
        const timeNow = new Date();
        res.send(timeNow)
    }
);

app.get(
    '/yearNow',
    (req, res) => {
        const timeNow = new Date()
        const yearNow = timeNow.getFullYear()
        res.json(yearNow)
    }
);

app.get(
    '/books/romance/contagem',
    (req, res) => {
        res.send(`a prateleira de romance possui ${romance.length}`)
    });


//requisição com query!
//a informação enviada por query é processada pelo server por  REQ.QUERY
app.get(
    '/books/romance/:identificador',
    async (req, res) => {
        let param = req.params.identificador;
        const livrosFiltrados = await romance.filter(
            (e, i) => { return e.identificador == param }
        )
        if (livrosFiltrados.length === 0) {
            res.json('o livro não foi encontrado!')
        }
        else {
            res.json(`o livro foi encontrado e custa ${livrosFiltrados[0].price}`)
        }
    }
)


const user1 = {
    username: 'matheus',
    password: '1234',
}
const user2 = {
    username: 'pedrinho',
    password: '1234'
}

const users = [user1, user2];




app.get('/auth', (req, res) => {

    if (req.query.username && req.query.password) {
        const username = req.query.username;
        const password = req.query.password;

        if (users.filter((e, i) => {
            return ((e.username == username) && (e.password == password))
        }).length == 1) {
            const token = 'kx123tr';
            res.send(`Usuário logado com sucesso! Seu token de acesso é ${token}`)
        } else {
            res.send('usuário não cadastrado ou não encontrado.')
        }
    } else {
        res.send('favor informar nomes de usuário e senha')
    }
})

//preciso respeitar a ordem. No caso abaixo, info1 é para username, e info2 é para password
app.get('/auth/:info1/:info2', (req, res) => {
    if (users.filter((e, i) => {
        return ((e.username == req.params.info1) && (e.password == req.params.info2))
    }).length == 1) {
        res.send('usuário encontrado! ')
    } else {
        res.send(false)
    }

})



app.get('/token', (req, res) => {
    const token = 'kx123tr';

    if (req.query.token === token) {
        res.send(true)
    } else {
        res.send(false)
    }
})




app.listen(4000,
    () => {
        console.log('A livraria está aberta!') //the server is up and running! 
    })


    // --- NPM packs
const express = require('express');
const app = express();
const mongoose = require("mongoose");


// --- Mongo Connection
mongoose.connect(
    '',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

app.get(
    '/',
    (req, res) => {
        res.send("Hello World")
        
    }
);


app.listen(4000,
    () => {
        console.log('A livraria está aberta!') //the server is up and running! 
    })