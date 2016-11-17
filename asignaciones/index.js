var bd = require('../bd')


function baja(idMedida, callback) {
    var where = {id_medida: idMedida}
    con.query("DELETE FROM asignaciones WHERE ?", where, function(err, rows) {
        if(err) {
            callback(err)
        } else {
            callback(null, rows)
        }
    })
}

function listar(callback, where, order) {

    var orden = '', cond = ''
    if(where) {
        cond = where
    }

    if(order) {
        orden = order
    }

    con.query('SELECT * FROM asignaciones ' + cond + orden, function(err, rows) {

        if(err) {
            callback(err)
        } else {
            callback(null, rows)
        }
    })
}



module.exports.listar = listar
module.exports.baja = baja
