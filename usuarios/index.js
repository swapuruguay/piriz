var con = require('../bd')

function del(idUsuario, callback) {
        var where = {id_usuario: idUsuario}
        con.query("DELETE FROM usuarios WHERE ?", where, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function save(user, callback) {

        con.query("INSERT INTO usuarios SET ?", user, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }


    function getByUsername(username, callback) {


        con.query('SELECT * FROM usuarios WHERE ?' , username, function(err, rows) {

            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }



module.exports.getByUsername = getByUsername
module.exports.save = save
module.exports.del = del
