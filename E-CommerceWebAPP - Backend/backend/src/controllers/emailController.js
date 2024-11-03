const nodemailer = require('nodemailer');
const formatDateTime = require('../utils/formatDate');
const UserVerificationToken = require('../models/UserVerificationToken');
const crypto = require('crypto');

exports.verifyEmail = async(user) => {
    try{
        const verificationToken = new UserVerificationToken({
            userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });
        const savedVerificationToken = await verificationToken.save();
        
        
        const link = `http://localhost:3001/api/users/confirmAccount/${savedVerificationToken.token}`;

        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth:{
                user: process.env.USER,
                pass: process.env.PASSWORD, 
            },
        });
       
        let info = await transporter.sendMail({
            from: process.env.USER,
            to: user.email,
            subject: "Email verification",
            text: "Welcome",
            html:`
            <div>
                <a href=${link}>Click here to activate your account!</a>
            </div>
            `      
        });
        console.log("email sent!");
    } catch(error){
        console.log(error);
    }
}
exports.confirmOrderEmail = async(email, orders) => {
    try{
        const total = orders.map(order => order.totalPrice).reduce((a,b) => a+b, 0);

        let htmlContent = `
            <div>
                ${orders
                .map(
                    (order) => `
                    <div>
                        <h2>Order number: ${order.orderNumber}; placed at: ${formatDateTime(order.createdAt)}</h2>
                        <h3>Order total: ${order.totalPrice}</h3>
                    </div>
                `
                )
                .join("")}
                <h2>Total to pay: ${total}; payment method: ${orders[0].paymentMethod}</h2>
                <div>
                    <h2>Address where the order will be delivered:</h2>
                    <p>Country: ${orders[0].address.country}</p>
                    <p>County: ${orders[0].address.county}</p>
                    <p>City: ${orders[0].address.city}</p>
                    <p>Street: ${orders[0].address.street}</p>
                    <p>Number: ${orders[0].address.number}</p>
                    <p>Zip: ${orders[0].address.zip}</p>
                </div>
                <h2>Your contact details: ${orders[0].phoneNumber}</h2>
                <h1>Thank you for your order!</h1>
            </div>
        `;
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth:{
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });
        
        let info = await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "Order confirmation",
            text: "Your order has benn received and is being taken care of!",
            html: htmlContent,
        });
        console.log("order confirmation email sent!", info);
    }catch(error){
        console.log(error);
    }
}
exports.orderStatusEmail = async(email, order) => {
    try{
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth:{
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });
        let info = await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "Order status",
            text: `Your order with number ${order.orderNumber} has been updated to ${order.status}`,
        });
        console.log("order status email sent!", info);
    }catch(error){
        console.log(error);
    }
}