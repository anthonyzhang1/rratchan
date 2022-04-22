/** MyError is used to differentiate standard JavaScript errors from our errors. */
class MyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MyError';
    }
}

module.exports = MyError;