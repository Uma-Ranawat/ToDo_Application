const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('key_token');
    // console.log("======================================================================"+token);

    if(!token) return res.status(400).send('Access Denied');
    // if(!token) return res.render('error', { page: 'Error', menuId: '', message: 'Access Denied', error:{status: 401}});

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        return res.status(400).send('Invalid Session Token');
        // return res.render('error', { page: 'Error', menuId: '', message: 'Invalid Session Token', error:{status: 400 }});
    }
};