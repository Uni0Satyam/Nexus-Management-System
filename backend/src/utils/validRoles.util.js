import { ApiError } from "./errorHandler.util.js";

const validRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            throw new ApiError(403, "Access denied!")
        }
        next();
    }
}

export {validRoles};