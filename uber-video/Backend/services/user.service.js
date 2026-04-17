const userModel = require('../models/user.model');


module.exports.createUser = async ({
    firstname, lastname, email, mobile, password, gender, age, collegeName, contactNumber, emergencyContact, isVerified, profileImageUrl
}) => {
    if (!firstname || (!email && !mobile) || !password || !gender) {
        throw new Error('First name, password, gender and either email or mobile are required');
    }
    
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        mobile,
        password,
        gender,
        age,
        collegeName,
        contactNumber,
        profileImageUrl,
        emergencyContacts: emergencyContact ? [{
            name: emergencyContact.name,
            mobile: emergencyContact.number,
            relationship: emergencyContact.relationship
        }] : [],
        isVerified: isVerified !== undefined ? isVerified : true // Default to verified
    });

    return user;
}
