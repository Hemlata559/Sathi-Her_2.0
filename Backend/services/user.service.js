const userModel = require('../models/user.model');


module.exports.createUser = async ({
    firstname, lastname, email, password,gender
}) => {
    if (!firstname || !email || !password ||!gender) {
        throw new Error('All fields are required');
    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        gender
    });

    return user;
}