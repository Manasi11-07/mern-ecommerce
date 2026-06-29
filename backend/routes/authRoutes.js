import express from 'express';
console.log("authRoutes loaded");
import { signupUser, loginUser } from '../controllers/authController.js';

const router = express.Router();
router.get('/test', (req, res) => {  //extra
    res.send('Auth route working');
});

router.post('/signup', signupUser);
router.post('/login', loginUser);

export default router;
