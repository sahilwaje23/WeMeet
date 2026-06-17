const jwt= require("jsonwebtoken");

const protect = (req,res,next)=>{

  try{

    const token=req.headers.authorization;

    if(!token){
      return res.status(401).json({
        message:"Unauthorized",
      });
    }


    // verify token 

    const decoded= jwt.verify(token,
      process.env.JWT_SECRET
    );

    // attack user info 

    req.user = decoded;

    next();
  }
  catch(error){

    return res.status(401).json({
      message:"Invalid token",
    });


  }
};

module.exports= protect;