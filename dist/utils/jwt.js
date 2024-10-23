import jwt from "jsonwebtoken";
const generateAccessToken = (payload, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, { expiresIn: "1h" }, (err, token) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
};
const generateRefreshToken = (payload, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, { expiresIn: "7d" }, (err, token) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
};
const validateAccessToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
};
const validateRefreshToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
};
export { generateAccessToken, generateRefreshToken, validateAccessToken, validateRefreshToken };
