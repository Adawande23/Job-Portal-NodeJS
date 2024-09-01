import jobModel from "../models/jobModel.js";
import moongoose from 'mongoose';
import moment from 'moment';

export const createJobController = async (req, res, next) => {
    const { company, position } = req.body;
    if (!company || !position) {
        next('Please Provice Details')
    }

    req.body.createdBy = req.user.userId;
    const job = await jobModel.create(req.body);
    res.status(201).json({
        succes: true,
        message: 'Job Created Successfully',
        job
    })
}

export const getAllJobsController = async (req, res, next) => {
    const jobs = await jobModel.find({ createdBy: req.user.userId })
    res.status(200).json({
        totalJobs: jobs.length,
        jobs
    })
}

export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position } = req.body;
    if (!company || !position) {
        next('Pls Provide All Feilds');
    }

    const job = await jobModel.findOne({ _id: id });
    if (!job) {
        next('No Job found')
    }

    if (!req.user.userId === job.createdBy.toString()) {
        next('You are not authorise to update this job');
        return;
    }

    const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidator: true })
    res.status(200).json({ updateJob })
}

export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;

    const job = await jobModel.findOne({ _id: id });
    if (!job) {
        next('No Job found')
    }

    if (!req.user.userId === job.createdBy.toString()) {
        next('You are not authorise to delete this job');
        return;
    }

    const deleteJob = await job.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Deleted Successful'
    })

}

export const jobStatsController = async (req, res) => {
    const stats = await jobModel.aggregate([
        // Search By User Job
        {
            $match: {
                createdBy: new moongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    //Monthly Or Yealy Stats

    let monthlyApplication = await jobModel.aggregate([
        {
            $match: {
                createdBy: new moongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }

            }
        }
    ])

    monthlyApplication = monthlyApplication.map(item => {
        const{_id:{year,month},count} = item;
        const date = moment().month(month-1).year(year).format('MMM Y');
        return {date,count};
    }).reverse()
    res.status(200).json({ totalJobs: stats.length, stats, monthlyApplication })
}