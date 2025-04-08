const jwt = require('jsonwebtoken');
const { User } = require('../models');

                   

   
                                                 
                                                                       
                  
                                                                 
                                             
   
const authenticate = async (req, res, next) => {
  try {
                                    

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    
                                             

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
                                                            

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
                                                                               

                                              

    if (decoded.exp < Date.now()) {
      return res.status(401).json({ message: 'Token expired' });
    }
    
                                                                   

    const user = await User.findByPk(decoded.id);
    
                                                                           

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
                                                                         

                                                                        

    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Token invalid' });
    }
    
                                   

    req.user = user;
    next();
  } catch (error) {
                                                                     

                                                                   

    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
                   


module.exports = { authenticate };