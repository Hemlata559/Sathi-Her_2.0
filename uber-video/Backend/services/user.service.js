const userModel = require('../models/user.model');


module.exports.createUser = async ({
    firstname, lastname, email, password, gender, age, collegeName, contactNumber, emergencyContact, isVerified
}) => {
    if (!firstname || !email || !password || !gender) {
        throw new Error('All fields are required');
    }
    
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        gender,
        age,
        collegeName,
        contactNumber,
        emergencyContacts: emergencyContact ? [{
            name: emergencyContact.name,
            mobile: emergencyContact.number
        }] : [],
        isVerified: isVerified !== undefined ? isVerified : true // Default to verified
    });

    return user;
}