const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    console.log('Error:', err.message);
    console.log('Name:', err.name);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Error de validación',
            details: err.message
        });
    }

    res.status(500).json({
        error: 'Error de servidor',
        message: err.message
    });
};

module.exports = errorHandler;