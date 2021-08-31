const { text } = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const filmes = require('./src/data/filmes.json');
const app = express();
app.use(express.json());

require('./models/Filme');
const Filme = mongoose.model("filmes");

// Config
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb+srv://Alef:047263@cluster0.ei0gx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('conectado com o mongo')
        }).catch((err) => {
            console.log('Erro ao se conectar ' + err);
        })


app.get('/', (req, res) => {
    res.json({from: "Alef Araujo"});
});

app.get('/filmes', (req, res) => {
    Filme.find().then((filmes) => {
        res.json(filmes);
    })
});

app.post('/filme/add', (req, res) => {
    const novoFilme = {
        nome: req.body.nome,
        foto: req.body.foto,
        descricao: req.body.descricao,
        elenco: req.body.elenco,
    }

    new Filme(novoFilme).save().then(() => {
        res.json({resp: "Filme adicionado com sucesso"});
    }).catch((err) => {
        console.log(err)
        res.json({resp: "Erro ao editar, temte novamente"});
    })
})


app.patch('/filme/edit', (req, res) => {
    Filme.findOne({_id: req.body.id}).then((filme) => {
        filme.nome = req.body.nome
        filme.foto = req.body.foto
        filme.descricao = req.body.descricao
        filme.elenco = req.body.elenco
        
        filme.save().then(() => {
            res.json({resp: "Filme editado com sucesso"});
        }).catch((err) => {
            res.json({resp: "Erro ao editar, temte novamente"});
        })
    }).catch((err) => {
        res.json({resp: "Erro ao editar, temte novamente"});
    })
})

// rota de deletar
app.delete('/filme/delete', (req, res) => {
    Filme.remove({_id: req.body.id}).then(() => {
        res.json({resp: "Filme deletado com sucesso"});
    }).catch((err) => {
        res.json({resp: "Erro ao deletar, temte novamente"});
    })
})




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor funcionando');
});