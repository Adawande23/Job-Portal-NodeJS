import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
    const { name, email, password, lastName } = req.body;
    // validate Name, Email, Password
    if (!name) {
        next('please provide name');
    }
    if (!email) {
        next('please provide email');
    }
    if (!password) {
        next('please provide password');
    }

    // Checking If User Already Exist Using FindOne Method
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        next('Email Id Already Exist Please Login')
    }

    // Create User
    const user = await userModel.create({ name, lastName, email, password });
    //Creating Token
    const token = user.createJWT();
    res.status(201).send({
        message: 'User Created Successfully',
        success: true,
        user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location
        },
        token
    })
}

export const loginController = async (req, res) => {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
        next('Please Provide Email Or Password')
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        next('Invalid UserName Or Password')
    }

    //ComparePassword
    const isMatch = await user.comparePassword(password);
    user.password = undefined;
    const token = await user.createJWT();
    res.status(200).json({
        success: true,
        message: 'Login Successfully',
        user,
        token
    })
}
