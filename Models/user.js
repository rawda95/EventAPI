const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    autoIncrement = require('mongoose-auto-increment'),

    Schema = mongoose.Schema;
autoIncrement.initialize(mongoose);


const UserSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true


    },

    password: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    Email: {
        type: String,
        unique: true,
        validate: function(email) {
            return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
        }
    }

});

UserSchema.pre('save', async function(next) {

    // not usfual 
    if (this.isNew) {
        const user = this;
        const hash = await bcrypt.hash(user.password, 10);

        user.password = hash;
    }
    next();
});

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;

    let hash = await bcrypt.hash(password, 10);

    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

UserSchema.plugin(autoIncrement.plugin, 'Users');

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;