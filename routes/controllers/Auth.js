const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.protectRoute = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const tokenAuthorized = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            if (tokenAuthorized) {
                return next();
            }
            req.user = process.env.ID;
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect("/login");
    }
};

/*Despues que el usuario ingresa no puede devolverse al login*/
exports.protectRouteLogOut = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const tokenAuthorized = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            if (tokenAuthorized) {
                res.redirect('/contactos')
            }
            req.user = process.env.ID;
        } catch (error) {
            console.log(error);
            res.redirect('/contactos')
        }
    } else {
        return next()
    }
};


/*Cerrar sesion*/
exports.logout = (req, res) => {
    res.clearCookie("jwt");
    return res.redirect("/login");
};



