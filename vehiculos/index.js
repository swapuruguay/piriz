var con = require('../bd')


    function baja(idVehiculo, callback) {
        var where = {id_vehiculo: idVehiculo}
        con.query("DELETE FROM vehiculos WHERE ?", where, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function alta(mov, callback) {
        con.query('INSERT INTO vehiculos SET ? ', mov, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function getById(idVehiculo, callback) {
        var cond = ` WHERE id_vehiculo = ${idVehiculo}`
        con.query(`SELECT * FROM vehiculos ${cond}` , function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function update(idVehiculo, tutu, callback) {
        var where = {id_vehiculo: idVehiculo}
        con.query(`UPDATE vehiculos SET ? WHERE id_vehiculo = ${idVehiculo}`, tutu, function(err, rows) {
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

        con.query('SELECT * FROM vehiculos ' + cond + orden, function(err, rows) {
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
module.exports.getById = getById
module.exports.update = update
