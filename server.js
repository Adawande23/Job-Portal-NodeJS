// API Documentation
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from 'swagger-jsdoc';

//Import
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';

//Security Packages
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize';

import connectDb from './config/db.js';

//routes import
import testRoutes from './routes/testRoute.js'
import authRoutes from './routes/authRoutes.js'
import errorMiddleware from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';

const app = express();

// congig env
dotenv.config(); // If env file is in root path

//MongoDb connection
connectDb();

// Swagger Api Config
const option = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Job Portal Application',
            description: 'NodeJs Express Job Portal Application'
        },
        servers: [
            {
                url: "https://job-portal-nodejs-n2u4.onrender.com"
            }
        ]
    },
    apis: [
        './routes/*.js'
    ]

}

const spec = swaggerDoc(option)

//middleware

// For anyone using Express v4.16+, body-parser is no longer needed as a third-party dependency.
app.use(helmet())   //Security for header section
app.use(mongoSanitize()) //Secure MongoDb database
app.use(express.json())
app.use(cors());
app.use(morgan('dev'))


//routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobsRoutes);

// homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

// Validation Middleware
app.use(errorMiddleware)

// Post Listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {})
