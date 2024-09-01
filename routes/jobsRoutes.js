import express from 'express'
import userAuth from './../middleware/authMiddleware.js';
import { createJobController, getAllJobsController, updateJobController, deleteJobController, jobStatsController } from '../controllers/jobsController.js';

const router = express.Router();

router.post('/create-job', userAuth, createJobController);

router.get('/get-job', userAuth, getAllJobsController);

router.patch('/update-job/:id',userAuth, updateJobController)

router.delete('/delete-job/:id',userAuth, deleteJobController)

router.get('/job-stats',userAuth, jobStatsController)

export default router;