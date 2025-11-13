import express from 'express';
import { getProfile, login, register, updateProfile, uploadImage } from "../controllers/membership/auth.js";
import { authenticateAccessToken, loginValidator, registerValidator } from '../middleware/authMiddleware.js';
import { fileUploadMiddleware, handleUploadErrors } from '../middleware/imageUploadMiddleware.js';

const app = express();
app.use(express.json());

app.post('/login', loginValidator, login);
app.post('/register', registerValidator, register);
app.get('/profile', authenticateAccessToken, getProfile);
app.put('/profile/update', authenticateAccessToken, updateProfile);
app.put('/profile/image', authenticateAccessToken, fileUploadMiddleware, handleUploadErrors, uploadImage);
export default app;