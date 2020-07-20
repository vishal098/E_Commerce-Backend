const jwt = require('jsonwebtoken')
let verifytoken = (req,res,next)=>{
    let decode = jwt.verify(req.headers.authorization,)
    if(typeof(decode) != 'undefined'){
        if(decode.startsWith('vishal')){
            decode = decode.slice(6,decode.length)
            console.log(decode);
            
        }
        req.token = decode; 
    }next();
}

module.exports = verifytoken


