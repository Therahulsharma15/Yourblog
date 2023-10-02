const { validate } = require("../models/user")
const { validateToken } = require("../services/auth")

function checkForAuthenticationCookie(cookieName) {
    return (req,res,next) => {
            const tokenCookieValue = req.cookies[cookieName]
            if(!tokenCookieValue) {
              return  next()
            }
           try {
            const Payload = validateToken(tokenCookieValue);
            console.log(Payload);
            req.user = Payload;
           
           } catch (error) {   }
          return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,

}