import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from '../models/Product.js';
import mongoose from "mongoose";

export const placeOrder = async (req, res) => {
    try {
        const { userId, address } = req.body;

        console.log(req.body);
        console.log(userId);
        console.log(address);


        // Get Cart 
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate('items.productId');
        console.log("Cart=", cart);
        console.log("Cart Items= ", cart.iyems);

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({message: "Cart is empty" });
        }
        console.log("Step 1");

        // Prepare Order Items
        const orderItems = cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        }));
        console.log("Step 2", orderItems);

        // Calculate Total Amount
        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        console.log("Step 3",totalAmount);

        // Deduct stock from Products
        for (let item of cart.items){
            await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
        }
        console.log("Step 4");

        // Create Order
        const order = await Order.create({
            userId,
            items: orderItems,
            address,
            totalAmount,
            paymentMethod: 'COD',
        });
        console.log("Step 5");

        //Clear Cart
        await Cart.findOneAndUpdate({ userId }, { items: [] });
        res.status(201).json({ message: "Order placed successfully", orderId: order._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message});
    }
};
