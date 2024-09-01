import moongoose from 'mongoose'

const jobSchema = new moongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company Name Required']
    },
    position: {
        type: String,
        required: [true, 'Job Position Required'],
        minlength: 10
    },
    status: {
        type: String,
        enum: ['pending', 'reject', 'interview'], // Enum Hold Array Of Status(THis status can be use as dropdown in frontend)
        default: 'pending'
    },
    workType: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract'],
        default: 'full-time'
    },
    workLocation: {
        type: String,
        required: [true, 'Work Location Required'],
        default: 'Mumbai'
    },
    createdBy: {
        type: moongoose.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

export default moongoose.model('Job', jobSchema)
