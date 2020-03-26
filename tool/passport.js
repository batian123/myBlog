/**
 *
 *  @author: Mr_Wei
 *  @version: 1.0.0
 *  @description: 验证token是否合法
 *  @Date: 2019/10/17 10:42
 *
 */

const User = require("../dbModel/user");
// const Admin = require("../dbModel/admin");
const Key = require("../tool/jwtkey").KEYORSECRET;
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Key;


module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);   //jwt_payload就是用户信息
        User.findById(jwt_payload.id)
            .then(user => {
                console.log('pp',user)
                if (user) {
                    return done(null, user);
                } else {
                    console.log('ppp')
                    // Admin.findById(jwt_payload.id)
                    //     .then(admin => {
                    //         if(admin){
                    //             return done(null, admin);
                    //         }else{
                    //
                    //             // or you could create a new account
                    //         }
                    //     })
                }
            })
    }));
}

// module.exports = passport => {
//     passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
//         console.log('ppppppppp:',jwt_payload)
//        let data = await User.findById(jwt_payload._id)
//         if (data) {
//             return done(null, user);
//         } else {
//             console.log('hhhhh')
//             return done(null, false);
//         }
//     }));
// }
