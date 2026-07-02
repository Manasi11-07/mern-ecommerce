import  express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cart.js';
import addressRoutes from './routes/address.js';
import orderRoutes from './routes/order.js';

dotenv.config();

const app = express();

app.use(cors()); //easily connect backend with frontend
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/order', orderRoutes);

app.get('/',(req, res) => {
    res.send('API is running....');
});                            //route

app.get('/api/auth/test', (req, res) => {
    res.send('server test route working');
});
connectDB();

app.listen(5001, () => {
    console.log('Auth route mounted at /api/auth');
});