import { ApiError } from "./errorHandler.util";

const validRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            throw new ApiError(403, "Access denied!")
        }
        next();
    }
}

export {validRole};