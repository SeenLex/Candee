const User = require("../../models/User");
const CryptoJS = require("crypto-js");
const Distributor = require("../../models/Distributor");
const Customer = require("../../models/Customer");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Review = require("../../models/Review");
const Question = require("../../models/Question");
const Reply = require("../../models/Reply");
const Cart = require("../../models/Cart");
const Favourites = require("../../models/Favourites");
const mongoose = require("mongoose");
const UserVerificationToken = require("../../models/UserVerificationToken");
const { verifyEmail } = require("../emailController");


const jwt = require("jsonwebtoken");


exports.updateUserSelf = async (req, res) => {
    const { id,password, confirm_password,...updateFields } = req.body;
    if (password || confirm_password) {
        if (!password || !confirm_password) {
            return res.status(400).json("You have to enter both password and confirm password");
        }
        if (password !== confirm_password) {
            return res.status(400).json("Passwords don't match");
        }

        updateFields.password = CryptoJS.AES.encrypt(password, process.env.PASS_SECRET).toString();
    }
    const restrictedFields = ['role', 'isAuthorized', 'isVerified'];
    for (const field in updateFields) {
        if (restrictedFields.includes(field)) {
            return res.status(400).json(`You can't update ${field}`);
        }
    }

    if(updateFields.hasOwnProperty('phoneNumber') && updateFields.phoneNumber.length !== 10)
    {
        return res.status(400).json("Phone number must have 10 digits");
    }
    try {
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json("User not found");
        }
        if (user.role === 'customer')
        {
            await Customer.findByIdAndUpdate(user._id, { $set: updateFields }, { new: true });
        }else if(user.role === 'distributor')
        {
            await Distributor.findByIdAndUpdate(user._id, { $set: updateFields }, { new: true });
        }
      
        const updatedUser = await User.findByIdAndUpdate(
            user._id, 
            { $set: updateFields }, 
            { new: true }
        ).populate('distributorInfo').populate('customerInfo');

        const updateToken = jwt.sign({ id: updatedUser._id,
             role: updatedUser.role, 
             email: updatedUser.email, 
             name: updatedUser.name ,
             phoneNumber: updatedUser.phoneNumber,
            distributorInfo: updatedUser.distributorInfo,
            customerInfo: updatedUser.customerInfo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
            },process.env.JWT_SECRET, { expiresIn: "3d" });

            const tokenExpiration = 1000 * 60 * 60 * 24 * 3;
            res.cookie("accessToken", updateToken, {
               
                expires: new Date(Date.now() + tokenExpiration), 
               
               
               
               
            });
            

        const { password, ...others } = updatedUser._doc;
       
        res.status(200).json({ user: others, accessToken: updateToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }
};
exports.updateUserByAdmin = async (req, res) => {
    const { id,password, confirm_password,...updateFields } = req.body;
    if (password || confirm_password) {
        if (!password || !confirm_password) {
            return res.status(400).json("You have to enter both password and confirm password");
        }
        if (password !== confirm_password) {
            return res.status(400).json("Passwords don't match");
        }

        updateFields.password = CryptoJS.AES.encrypt(password, process.env.PASS_SECRET).toString();
    }
    if (updateFields.CUI && updateFields.CUI.length !== 6) {
        return res.status(400).json("CUI must have 6 digits");
    }

    if (updateFields.phoneNumber && updateFields.phoneNumber.length !== 10) 
    {
        return res.status(400).json("Phone number must have 10 digits");
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json("User not found");
        }
        if (user.role === 'customer')
        {
            await Customer.findByIdAndUpdate(user._id, { $set: updateFields }, { new: true });
        }else if(user.role === 'distributor')
        {
            await Distributor.findByIdAndUpdate(user._id, { $set: updateFields }, { new: true });
        }

        const updatedUser = await User.findByIdAndUpdate( user._id, { $set: updateFields }, { new: true }).populate('distributorInfo').populate('customerInfo');
        const { password, ...others } = updatedUser._doc;
        res.status(200).json({message: "User has been updated", user: others});
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }

}


// exports.deleteUser = async (req, res) => {
//     try {

//         const user = await User.findById(req.body.id);
//         if (!user) {
//             return res.status(404).json("User not found");
//         }
//         if(user.role === 'distributor')
//         {
//             const distributor = await Distributor.findById(user._id);
//             if(!distributor){
//                 return res.status(404).json("Distributor not found");
//             }
//             await Distributor.findByIdAndDelete(distributor._id);
//         }
//         if(user.role === 'customer')
//         {
//             const customer = await Customer.findById(user._id);
//             if(!customer){
//                 return res.status(404).json("Customer not found");
//             }
//             await Customer.findByIdAndDelete(customer._id);
//             await Order.deleteMany({user: user._id});

//         }
//         await User.findByIdAndDelete(user._id);


      
//         res.status(200).json({ message: "User has been deleted" });
//     }
//     catch (err) {
//         res.status(500).json(err);
//     }
// }


exports.deleteUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.body.id;
        const user = await User.findById(userId).session(session);
        
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json("User not found");
        }

      
        if (user.role === 'distributor') {
            await Distributor.findByIdAndDelete(user._id).session(session);
    
            await Product.deleteMany({ distributor: user._id }).session(session);
            await Cart.deleteMany({ 'products.distributor': user._id }).session(session);
            await Favourites.deleteMany({ 'products.distributor': user._id }).session(session);
            await Review.deleteMany({ 'product.distributor': user._id }).session(session);
            await Order.deleteMany({ distributor: user._id }).session(session);

        } else if (user.role === 'customer') {
            await Customer.findByIdAndDelete(user._id).session(session);
       
            await Order.deleteMany({ user: user._id }).session(session);
            await Review.deleteMany({ user: user._id }).session(session);
            await Cart.deleteOne({ user: user._id }).session(session);
            await Favourites.deleteOne({ user: user._id }).session(session);
        }

        
        await Question.deleteMany({ user: user._id }).session(session);
        await Reply.deleteMany({ user: user._id }).session(session);

       
        await User.findByIdAndDelete(user._id).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "User and all associated data have been deleted" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error in deleteUser:', err);
        res.status(500).json({ message: "An error occurred while deleting the user", error: err.message });
    }
};
exports.getUser = async (req, res) => {
    try {
   
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json("User not found");
        
        }
        if(req.user.role === 'admin')
        {
            const userData = await User.findById(user._id).populate('distributorInfo').populate('customerInfo');
            const { password, ...others } = userData._doc;
            return res.status(200).json(others);
        }
        if(req.user.role === 'distributor')
        {
            const userData = await User.findById(user._id).populate('distributorInfo');
            const { password, ...others } = userData._doc;
            return res.status(200).json(others);
        }
        if(req.user.role === 'customer')
        {
            const userData = await User.findById(user._id).populate('customerInfo').populate('distributorInfo','address CUI')
            const { password, ...others } = userData._doc;
            return res.status(200).json(others);
        }



        
    } catch (err) {
        res.status(500).json(err);
    }
}
exports.resendVerificationEmail = async (req, res) => {
    try {
       
        const user = await User.findById(req.user.id
        ).populate('customerInfo').populate('distributorInfo');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }
     
        
        res.status(200).json({ message: "Verification email sent" });
        await verifyEmail(user);
    } catch (err) {
        res.status(500).json(err);
    }
}
exports.confirmAccount = async (req, res)=>
    {
        try{
            const token = await UserVerificationToken.findOne({
                token: req.params.token,
            });
            const user = await User.findById(token.userId);
            if (!user) {
                return res.status(404).send("User not found.");
            }
            if (user.role === 'customer') {
                const customer = await Customer.findById(user._id);
                if (!customer) {
                  return res.status(404).send("Customer not found.");
                }
                
                customer.isVerified = true;
                await customer.save();

                const updateToken = jwt.sign({ 
                    id: customer._id,
                    role: user.role,
                    email: user.email,
                    name: user.name,
                    phoneNumber: user.phoneNumber,
                    customerInfo: {
                      isVerified: customer.isVerified,
                        address: customer.address,
                        payment : customer.payment,
                        createdAt: customer.createdAt,
                        updatedAt: customer.updatedAt

                    },
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                  }, process.env.JWT_SECRET, { expiresIn: "3d" });
            
                
                
              
                


                  
       
                   const tokenExpiration = 1000 * 60 * 60 * 24 * 3;
                   res.cookie("accessToken", updateToken, {
                      
                       expires: new Date(Date.now() + tokenExpiration), 
                      
                      
                      
                      
                   });
                
              
             
              }
              res.status(200).send("Account verified successfully.");
            await UserVerificationToken.findByIdAndRemove(token._id);
           
        }catch(error){
            res.status(500).json(error);
        }
    }

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        if(!users){
            return res.status(404).json("No users found");
        }
        const nonAdminUsers = users.filter(user => user.role !== 'admin');

        const infoUser = await Promise.all(nonAdminUsers.map(async (user) => {
            if(user.role === 'admin')
            {
                return;
            }
            if (user.role === 'distributor') {
                const userData = await User.findById(user._id).populate('distributorInfo');
                const { password, ...others } = userData._doc;
                return others;
            }
            if (user.role === 'customer') {
                const userData = await User.findById(user._id).populate('customerInfo');
                const { password, ...others } = userData._doc;
                return others;
            }
           
        }));

        
        return res.status(200).json(infoUser);
    }
    catch(err){
        return res.status(500).json(err);
    }
}




