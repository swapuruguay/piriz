var con = require('../bd')


    function baja(idMedida, callback) {
        var where = {id_medida: idMedida}
        con.query("DELETE FROM movimientos WHERE ?", where, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function alta(mov, callback) {
        con.query('INSERT INTO movimientos SET ? ', mov, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function listar(where, order, callback) {
        var orden = '', cond = ''
        if(where) {
            cond = where
        }

        if(order) {
            orden = order
        }

        con.query('SELECT * FROM movimientos ' + cond + orden, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }


module.exports.alta = alta
module.exports.baja = baja
module.exports.listar = listar
