// Error Middleware (Next Function is middleware)

const errorMiddleware = (err, req, res, next) => {
    const defaultErrors = {
        statusCode: 500,
        message: err
    }

    // Code Missing Feild Error
    if (err.name === 'ValidationError') {
        defaultErrors.statusCode = 400
        defaultErrors.message = Object.values(err.errors).map((item) => item.message).join(',')
    }

    if (err.code && err.code === 11000) {
        defaultErrors.statusCode = 400
        defaultErrors.message = `${Object.keys(err.keyValue)} feild has to be unique`
    }
    res.status(defaultErrors.statusCode).json({ message: defaultErrors.message })
}

export default errorMiddleware;