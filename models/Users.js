const { default: mongoose } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")

const modelagem = {
    username: {
        type: String,
        required: [true, 'o campo é necessário']
    },
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
};

const UserSchema = new mongoose.Schema(modelagem)
UserSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', UserSchema);

module.exports = User;