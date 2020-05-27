import { protect } from "./jwt";

export const protectRoutes = async (
    req,
    res,
    next
) => {
    const unprotectedRoutes = [
        { path: "/api/v1/user/login", method: "POST" },
        { path: "/api/v1/user/register", method: "POST" },
        { path: "/api/v1/user/reset-password", method: "POST" },
    ];
    if (unprotectedRoutes.find(
        (route) =>
            req.path === route.path && route.method.indexOf(req.method) !== -1
    )) return next();
    else {
        // If the token in the Headers isn't present, we return an error.
        if (!req.headers["x-access-token"])
            return next(new Error("No authorization headers."));

        // Finally, we call our JWT module and pass the user's token hash to verify the token
        return protect(req, res, next);
    }
};

export const isAdmin = async (req, res, next) => {
    if (!req.current_user) return next(new Error("You don't have permissions."))
    if (req.current_user.role === "superadmin") {
        next();
    } else res.status(403).send(new Error(`You must be an admin to access this route`))
}