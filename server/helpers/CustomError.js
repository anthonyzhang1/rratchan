/** CustomError is used to differentiate standard JavaScript errors from our errors. */
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomError';
    }
}

module.exports = CustomError;