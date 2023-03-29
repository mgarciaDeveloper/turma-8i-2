const { default: mongoose } = require("mongoose");

const modelagem = {
    cnpj: {
        type: Number,
        unique:true,
        required: [true, 'o campo é necessário']
    },
    important: {
        type: Boolean,
        default: false
    },
    zipCode: {
        type: String,
        required: [true, 'o campo é necessário']
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },

    employees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
    ]
};

const Branch = mongoose.model('Branch', new mongoose.Schema(modelagem));

module.exports = Branch;