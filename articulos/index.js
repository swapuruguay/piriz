var con = require('../bd')

function del(idArticulo, callback) {
        var where = {id_articulo: idArticulo}
        con.query("DELETE FROM articulos WHERE ?", where, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function save(art, callback) {

        con.query("INSERT INTO articulos SET ?", art, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function getById(idArticulo, callback) {
        var cond = ` WHERE id_articulo = ${idArticulo}`
        con.query(`SELECT * FROM articulos ${cond}` , function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function update(idArticulo, art, callback) {
        
        con.query(`UPDATE articulos SET ? WHERE id_articulo = ${idArticulo}`, art, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function updateCantidad(art, where, callback) {


        con.query("UPDATE articulos SET cantidad = cantidad + ? WHERE ?", [art, where], function(err, rows) {
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

        var sql = 'SELECT * FROM articulos ' + cond + orden
        console.log(sql)

        con.query(sql , function(err, rows) {

            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

    function asignar(articulo, vehiculo, cantidad, callback) {
        var asig = {
            id_articulo_fk: articulo.id_articulo,
            id_vehiculo_fk: vehiculo.id_vehiculo
        }
        con.query("INSERT INTO asignaciones SET ?", asig, function(err, rows) {
            if(err) {
                callback(err)
            } else {
                callback(null, rows)
            }
        })
    }

module.exports.listar = listar
module.exports.save = save
module.exports.del = del
module.exports.updateCantidad = updateCantidad
module.exports.asignar = asignar
module.exports.update = update
module.exports.getById = getById
