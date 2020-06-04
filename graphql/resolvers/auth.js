const bcrypt = require('bcryptjs');

const User = require('../../models/user');

module.exports = {
    createUser: async (args) => {
        try {
            const findUser = await User.findOne({ email: args.userInput.email });
            if (findUser) {
                throw new Error('User already exists!'); 
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const newUser = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await newUser.save();
            return { ...result._doc, password: null, _id: result.id };
        }  
        catch (err) {
            console.log(err);
            throw err;
        }  
    }
}