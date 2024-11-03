
const User = require('../../models/User');
const Cart = require('../../models/Cart');
const Distributor = require('../../models/Distributor');
const Customer = require('../../models/Customer');
const Favourites = require('../../models/Favourites');
const CryptoJS = require('crypto-js');

const jwt = require('jsonwebtoken');
const { verifyEmail } = require('../emailController');



const tokenExpiration = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

exports.registerUser = async (req, res) => {
    try {
        
        if(req.body.password !== req.body.confirm_password){
            return res.status(400).json({message: "Passwords do not match"});
        }
        if(req.body.password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        
        }
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
            role: req.body.role,
            phoneNumber: req.body.phoneNumber? req.body.phoneNumber : null,
        });


       
        if(req.body.role === 'distributor'){
            
            const newDistributor = new Distributor({
                _id: newUser._id,
                address: req.body.address,
                CUI: req.body.CUI,
            });
           
            const savedDistributor = await newDistributor.save();
            if(!savedDistributor){
                return res.status(400).json({message: "Distributor not saved"});
            
            }
       

            newUser.distributorInfo = savedDistributor._id;
        }
        if(req.body.role === 'customer'){
        
            const newCustomer = new Customer( {_id: newUser._id} );    
            const savedCustomer = await newCustomer.save();
            if(!savedCustomer){
                return res.status(400).json({message: "Customer not saved"});
                
            }

            newUser.customerInfo = savedCustomer._id;
        }
        
    
        const user = await newUser.save();
        if(!user){
            return res.status(400).json({message: "User not saved"});
        }
 

       
        
        if(user.role === 'customer')
        {
            const newCart = new Cart({ products: [], user: user._id });
            const savedCart = await newCart.save();
            if(!savedCart){
                return res.status(400).json({message: "Cart not saved"});
                
            }
            const newFavourites = new Favourites({ products: [], user: user._id });
            const savedFavourites = await newFavourites.save();
            if(!savedFavourites){
                res.status(400).json({message: "Favourites not saved"});
                return;
            }
        }

      
       
        const {password, ...others} = user._doc;
        const accessToken = jwt.sign(
            { 
                id: user.id,
                role: user.role,
                email: user.email,
                name: user.name,
                customerInfo: user.customerInfo,
                distributorInfo: user.distributorInfo,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );
        console.log(user);
        res.cookie("accessToken", accessToken, {
           
            expires: new Date(Date.now() + tokenExpiration), 
         
           
           
           
        });
        if(user.role ==='customer')
        {
            await verifyEmail(user);
            
           
                
            res.status(200).send({
                message: 'Verification email sent. Please check your email',
                user: others,
                

            });
        }
        if(user.role === 'distributor'){
            res.status(200).send({
                message: 'Distributor account created',
                user: others,
             

            });
        }
        
    } catch (err) {
        if(err.code === 11000){
            if(err.keyValue.email){
            return res.status(400).json({message: "Email already exists"});
            }
            if(err.keyValue.CUI){
                return res.status(400).json({message: "CUI already exists"});
            }
            
        }

        res.status(500).json(err);
    }
}
exports.loginUser =  async (req, res) => {

    try {
        const user = await User.findOne({
            email: req.body.email,
        }).populate('customerInfo').populate('distributorInfo');
        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET).toString(CryptoJS.enc.Utf8);
        const password = hashedPassword.toString(CryptoJS.enc.Utf8);
        if(password === req.body.password){
            const{password, ...others} = user._doc;
            const accessToken = jwt.sign(
                { 
                    id: user.id,
                    role: user.role,
                    email: user.email,
                    name: user.name,
                    customerInfo: user.customerInfo,
                    distributorInfo: user.distributorInfo,
                    createdAt: user.createdAt,
                    phoneNumber: user.phoneNumber,
                  
                },
                process.env.JWT_SECRET,
                { expiresIn: "3d" }
            );
            res.cookie("accessToken", accessToken, {
               
                expires: new Date(Date.now() + tokenExpiration), 
             
               
               
               
            });

            res.status(200).json({
                user: others,
                accessToken: accessToken,
                

            });
           
        } else {
            res.status(401).json({message: "Invalid credentials"});
        }
    } catch (err) {
        res.status(500).json(err);
    }
}
exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if(!token){
            return res.status(403).json({message: "User not authenticated"});
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err){
                return res.status(403).json({message: "User not authenticated"});
            }
            const accessToken = jwt.sign(
                { 
                    id: user.id,
                    role: user.role,
                    email: user.email,
                    name: user.name,
                    customerInfo: user.customerInfo,
                    distributorInfo: user.distributorInfo,
                    createdAt: user.createdAt,
                    phoneNumber: user.phoneNumber,
                    
                  
                },
                process.env.JWT_SECRET,
                { expiresIn: "3d" }
            );
            res.cookie("accessToken", accessToken, {
               
                expires: new Date(Date.now() + tokenExpiration), 
                sameSite : 'none',
                secure: true,
               
               
            });
            res.status(200).json({accessToken});
        });
    } catch (err) {
        res.status(500).json(err);
    }
}
exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.status(200).json({ message: "Logged out" });
    } catch (err) {
        res.status(500).json(err);
    }
}   
