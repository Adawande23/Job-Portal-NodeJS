import express from 'express';
import { testPostController } from '../controllers/testController.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//routes
router.post('/test-post',userAuth, testPostController)

export default router;