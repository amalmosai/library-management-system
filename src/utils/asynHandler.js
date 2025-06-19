const asyncWrapper = (handler) => {
    return async function (req, res, next) {
        try {
            await handler(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

export default asyncWrapper;
