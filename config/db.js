import moongoose from 'mongoose';
import colors from 'colors';

const connectDb = async() =>{
    try {
        const conn = await moongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        return error;
    }
}

export default connectDb ;