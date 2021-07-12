const send = {
    sendData : (res, statusCode, data) => {
        res.status(statusCode).json({
            data: data
        })
    },

    sendError : (res, statusCode, errorMessage) => {
        res.status(statusCode).json({
            error: {
                message: errorMessage
            }
        })
    }
}

module.exports = send