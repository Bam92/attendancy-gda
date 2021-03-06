const db = require("../db");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        title: "Login",
        userId: undefined,
    });
};

exports.postLogin = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    await db
        .query(`SELECT * FROM users where username='${username}'`)
        .then((result) => {
            const user = result.rows[0];
            if (user && password == user.password) {
                req.session.user = user;
                res.cookie("session", user);
                return res.redirect("/admin");
            }
            res.redirect("/login");
        })
        .catch((error) => {
            const err = new Error(error)
            err.httpStatusCode = 500;
            return next(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy();
    res.cookie("session", undefined);
    res.status(200).clearCookie("connect.sid", {
        path: "/",
    });
    res.redirect("/login");
};
