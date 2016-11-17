var con = require('../bd')


    function baja(idMedida, callback) {
        var where = {id_medida: idMedida}
        con.query("DELETE FROM medidas WHERE ?", where, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function alta(medida, callback) {
        con.query('INSERT INTO medidas SET ? ', medida, function(err, rows) {
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

        con.query('SELECT * FROM medidas ' + cond + orden, function(err, rows) {

            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function getById(idMedida, callback) {
        var cond = ` WHERE id_medida = ${idMedida}`
        con.query(`SELECT * FROM medidas ${cond}` , function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function update(idMedida, metro, callback) {
        var where = {id_medida: idMedida}
        con.query(`UPDATE medidas SET ? WHERE id_medida = ${idMedida}`, metro, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }


module.exports.alta = alta
module.exports.listar = listar
module.exports.baja = baja
module.exports.update = update
module.exports.getById = getById
