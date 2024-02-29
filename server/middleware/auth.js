const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {

    try {
        // const token = req.headers["authorization"].split(" ")[1];
        const token = req.headers["authorization"];

        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(200).send({
                    msg: "Auth Failed",
                    success: false,
                });
            }
            else {
                req.body.userId = decode.id;    // decode.id means id nikla token se
                next();
            }
        });

    }
    catch (error) {
        console.log(error);
        res.status(401).send({
            msg: "error, Auth Failed",
            success: false
        });

    }

}


module.exports = verifyToken;



/**//**///*/*/*/**// */ */ */


// const jwt = require("jsonwebtoken");
// const config = require("../config/config");

// //const connect= require("../mongooseconnect");

// const verifyToken = async (req, res, next) => {

//     const token = req.params.token || req.body.token || req.query.token || req.headers["authorization"];

//     if (!token) {
//         res.status(200).send({ success: false, msg: "A token is required for authentication" });

//     }
//     try {

//         const descode = jwt.verify(token, config.secret_jwt);
//         req.user = descode;

//     }
//     catch (error) {

//         res.status(400).send("Invalid Token");

//     }

//     return next();

// }


// module.exports = verifyToken;

/**//**///*/*/*/**// */ */ */