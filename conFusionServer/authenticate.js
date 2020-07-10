var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');

var JwtStratergy = require('passport-jwt').Strategy; //stratergy used to authenticate user in passport by using jwtstratergy
var ExtractJwt = require('passport-jwt').ExtractJwt; //used to extract tokens(payload) from header or body
var jwt = require('jsonwebtoken'); //used to create ,verify and sign users
var config = require('./config.js'); 


exports.getToken = function(user) //used to get token using jwt by signing the user we pass in user secretkey    for the payload
{
    return jwt.sign(user,config.secretOrKey,{expiresIn:3600});
};
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //we are saying to authenticate the user using token by extracting it from header as bearer token
opts.secretOrKey =config.secretOrKey; //using secretKey from token

//we are saying the passport to user jwt token as our stratergy to authenticate user Ex: same as Local using username and password we pass in opts which we set and also the callback function done is also a callback used to say the status now Users.findOne will search for user from mongodb with the id as jwt_payload._id this is passed in as header as we know now if we got to know he is valid regiserred user we will call the callback function with params as err if any or null and second param is user false means he is not registered


exports.jwtPassport = passport.use(new JwtStratergy(opts,(jwt_payload,done)=>
{
    console.log('JWT payload: ',jwt_payload);
    User.findOne({_id:jwt_payload._id},(err,user)=>
    {
        if(err)
        {
            return done(err,false);
        }
        else if(user)
        {
            return done(null,user);
        }
        else
        {
            return done(null,false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt',{session:false}); //here we are sayinf to verify user authenticate user by jwt and we dont need session to track a user

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());