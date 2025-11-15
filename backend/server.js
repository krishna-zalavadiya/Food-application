import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { connectDB } from './config/db.js';
import { fileURLToPath } from 'url';
import path from 'path';

// ✅ These two lines replace __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// ✅ Import routes
import userRoute from './routes/userRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to Database
connectDB();

// ✅ Routes
app.use('/api/user', userRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRouter);

app.get('/', (req, res) => {
    res.send('API working');
});

app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
