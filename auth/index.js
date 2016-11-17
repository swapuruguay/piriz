var LocalStrategy = require('passport-local').Strategy
var usuarios = require('../usuarios')
var bcrypt = require('bcrypt-nodejs')

exports.strategy = new LocalStrategy( function(username, password, done) {
    usuarios.getByUsername({username: username}, function(err, user) {
        //console.log(user)
        if(err) return done(err)
        if(user.length > 0) {
            //var hash = bcrypt.hashSync(password)
            //console.log(bcrypt.compareSync(password, hash))
            if(bcrypt.compareSync(password, user[0].password)) {
                return done(null, user[0])
            } else {
                //req.flash({error_msg: 'Usuario no encuentra'})
                return done(false, false, {mesage: 'No se encuetra usuario'})
            }
        } else {
            return done(false, false, {message: 'Usuario desconocido'})
        }
    })
})


exports.serialize = function(user, done) {
    done(null, user)
}

exports.deserialize = function(user, done) {
    done(null, user)
}
