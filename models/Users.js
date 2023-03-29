const { default: mongoose } = require("mongoose");

const modelagem = {
    name: {
        type: String,
        required: [true, 'o campo é necessário']
    },
    cpf: {
        type: Number,
        unique: true,
        required: [true, 'o campo é necessário']
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    manager: {
        type: Boolean
    },
    type: {

        type: String,
        required: [true, 'categoria é obrigatória!'],
        enum: ['Funcionário', 'Cliente'],
        default: 'Cliente'
    },
    password: {
        type: String,
        required: [true, 'categoria é obrigatória!'],
    }
};

const User = mongoose.model('User', new mongoose.Schema(modelagem));

module.exports = User;