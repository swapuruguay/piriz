var express = require('express')
var app = express()
var multer  = require('multer')
var fs = require('fs')
var upload = multer({ dest: 'uploads/' })
var articulo = require('./articulos')
var medida = require('./medidas')
var movimiento = require('./movimientos')
var vehiculo = require('./vehiculos')
var session = require('express-session')
var cookie = require('cookie-parser')
var usuarios = require('./usuarios')
var passport = require('passport')
var auth = require('./auth')
var flash = require('connect-flash')
var inc = require('./inc/header.js').cabecera



var bodyParser = require('body-parser')

var TelegramBot = require('node-telegram-bot-api')

var token = '162759161:AAHEpDWOKYiO3cp6pFDkzCmaDR2Ek9ZSMbs'
// Setup polling way
var bot = new TelegramBot(token, {polling: true})

app.use(bodyParser.urlencoded({extended:true}))
app.use(cookie())

app.use(session({
    secret: 'abc12345',
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(auth.strategy)
passport.serializeUser(auth.serialize)
passport.deserializeUser(auth.deserialize)

function ensureAuth(req, res, next) {
    if(req.isAuthenticated()) {

        return next()
    }
    res.redirect('/login')
}


app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))

var user = {
    name: 'Walter',
    avatar: 'foton.jpg'
}

app.get('/', ensureAuth, function(req, res) {
    var cabecera = inc(req.user)
    res.render('pages/index', {inc: cabecera})

})

app.get('/login', function(req, res) {

    res.render('pages/login')
})

app.post('/login', passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login',failureFlash: true})

)

app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/login')
})
app.get('/articulos/alta', ensureAuth, function(req, res) {

        medida.listar(function(err, rows) {
            if(!err) {
                var cabecera = inc(req.user)
                res.render('pages/altaarticulos', {filas: rows, inc: cabecera})
            }

        })


//    res.render('pages/altaarticulos')
})

app.post('/articulos/alta', function(req, res) {
    //console.log(req.body)
    var mov = {
        id_articulo_fk: req.body.id,
        cantidad: req.body.cantidad,
        nuevo: 1
    }
    movimiento.alta(mov, function(err, rows) {
        if(!err) {
            articulo.updateCantidad(mov.cantidad, {id_articulo: mov.id_articulo_fk},function(err, rows) {
                console.log('HOla mundoh')
            })
            res.send({})
        }
    })
})

app.get('/articulos/listar', function(req, res) {
    articulo.listar('', '', function(err, rows) {
        if(!err) {
            var cabecera = inc(req.user)
            //console.log(filas)
            res.render('pages/articulos-listar', {filas: rows, inc: cabecera})
        } else {
            console.log(err)
            res.end()
        }
    })

})

app.get('/articulos/compra', ensureAuth, function(req, res) {
    var cabecera = inc(req.user)
        res.render('pages/compras', {inc: cabecera})

})

app.post('/articulos', upload.single('foto'),function(req, res) {
    var art = { codigo: req.body.codigo,
                  nombre: req.body.nombre,
                  minimo: req.body.minimo,
                  descripcion: req.body.descripcion,
                  id_medida_fk: req.body.medida

                  }
                  if(req.file) {
                      art.foto = req.file.originalname
                  }
                  console.log(req.body)
    articulo.save(art, function(err, rows) {
        if(err) {
            console.log(err)
            res.end()
        } else {
            if(req.file) {
                var fs = require('fs')

                var path = req.file.path
                var newPath = './uploads/'+req.file.filename
                fs.createReadStream('./uploads/'+req.file.filename).pipe(fs.createWriteStream('./public/fotos/'+req.file.originalname));
                //borramos el archivo temporal creado
                fs.unlinkSync(newPath)
            }
            //bot.sendMessage(151423105, 'Diste de alta a '+ art.nombre)
            //bot.sendMessage(151423105, 'Diste de alta a '+art.nombre)
            res.redirect('articulos/alta')
     }
    })
})

app.post('/articulos/search' , function(req, res) {
    var text = req.body.texto
    articulo.listar(' WHERE codigo LIKE \'' + text + '%\'', '', function(err, rows) {
        if(!err) {
            //console.log(rows)
            res.send({filas: rows})
        } else {
            console.log(err)
        }

    })


})

app.get('/articulos/edit/:id', function(req, res) {
    id = req.params.id
    articulo.getById(id, function(err, lineas) {
        if(!err) {
            //console.log(rows)
            medida.listar(function(err, rows) {
                if(!err) {
                    var cabecera = inc(req.user)
                    res.render('pages/articulos-edit', {art: lineas[0], filas: rows, inc: cabecera})
                }

            })


        }
    })


})

app.post('/articulos/edit/:id', upload.single('foto'), function(req, res) {
    var imgUrl;
    if(req.body.url) {
        imgUrl = req.body.url
    }

    var art = { codigo: req.body.codigo,
                  nombre: req.body.nombre,
                  minimo: req.body.minimo,
                  descripcion: req.body.descripcion,
                  id_medida_fk: req.body.medida

                  }

                  if(req.file) {
                      art.foto = req.file.originalname
                  }

                  console.log(art)

        articulo.update(req.params.id, art, function(err, filas) {
            if(err) {
                console.log(err)
                res.end()
            } else {
                if(req.file) {
                    var fs = require('fs')

                    var path = req.file.path
                    var newPath = './uploads/'+req.file.filename
                    fs.createReadStream('./uploads/'+req.file.filename).pipe(fs.createWriteStream('./public/fotos/'+req.file.originalname));
                    //borramos el archivo temporal creado
                    if(imgUrl) {

                        fs.unlinkSync('./public/fotos/'+imgUrl)
                    }
                    fs.unlinkSync(newPath)
                }
                //bot.sendMessage(151423105, 'Diste de alta a '+ art.nombre)
                //bot.sendMessage(151423105, 'Diste de alta a '+art.nombre)
                articulo.listar('', '', function(err, rows) {
                    if(!err) {
                        var cabecera = inc(req.user)
                        //console.log(filas)
                        res.render('pages/articulos-listar', {filas: rows, inc: cabecera})
                    } else {
                        console.log(err)
                        res.end()
                    }
                })
         }
        })


})

app.get('/articulos/delete/:id', function(req, res) {
    id = req.params.id
    articulo.getById(id, function(err, rows) {
        if(!err) {
            //console.log(rows)
            var cabecera = inc(req.user)
            res.render('pages/articulos-confirm', {art: rows[0] , inc: cabecera})
        }
    })



})

app.post('/articulos/delete/:id', function(req, res) {
    id = req.params.id
    articulo.del(id, function(err, rows) {
        if(!err) {
            vehiculo.listar('', '', function(err, lineas) {
                if(!err) {
                    var cabecera = inc(req.user)
                    //console.log(filas)
                    res.send({ok: 'Ok'})
                } else {
                    console.log(err)
                    res.end()
                }
            })
        }
    })
})

app.get('/vehiculos/alta', ensureAuth, function(req, res) {
    var cabecera = inc(req.user)
    res.render('pages/altavehiculos', {inc: cabecera})

    //    res.render('pages/altaarticulos')
})

app.post('/vehiculos/alta', function(req, res) {

    var mov = {
        matricula: req.body.matricula,
        descripcion: req.body.descripcion,

    }
    vehiculo.alta(mov, function(err, rows) {
        if(!err) {
            res.redirect('/vehiculos/alta')
        }
    })
})

app.get('/vehiculos/listar', function(req, res) {
    vehiculo.listar('', '', function(err, rows) {
        if(!err) {
            var cabecera = inc(req.user)
            var filas = rows
            //console.log(filas)
            res.render('pages/vehiculos-listar', {filas: rows, inc: cabecera})
        } else {
            console.log(err)
            res.end()
        }
    })

})

app.get('/vehiculos/edit/:id', function(req, res) {
    id = req.params.id
    vehiculo.getById(id, function(err, rows) {
        if(!err) {
            //console.log(rows)
            var cabecera = inc(req.user)
            res.render('pages/vehiculos-edit', {tutu: rows , inc: cabecera})
        }
    })


})

app.post('/vehiculos/edit/:id', function(req, res) {

        var tutu = {matricula: req.body.matricula, descripcion: req.body.descripcion}
        vehiculo.update(req.params.id, tutu, function(err, filas) {
            if(!err) {

                vehiculo.listar('', '', function(err, lineas) {
                    if(!err) {
                        var cabecera = inc(req.user)
                        //console.log(filas)
                        res.render('pages/vehiculos-listar', {filas: lineas, inc: cabecera})
                    } else {
                        console.log(err)
                        res.end()
                    }
                })
            } else {
                console.log(err)
            }
        })


})

app.get('/vehiculos/delete/:id', function(req, res) {
    id = req.params.id
    
    vehiculo.getById(id, function(err, rows) {
        if(!err) {
            //console.log(rows)
            var cabecera = inc(req.user)
            res.render('pages/vehiculos-confirm', {tutu: rows[0] , inc: cabecera})
        }
    })



})

app.post('/vehiculos/delete/:id', function(req, res) {
    id = req.params.id
    vehiculo.baja(id, function(err, rows) {
        if(!err) {
            vehiculo.listar('', '', function(err, lineas) {
                if(!err) {
                    var cabecera = inc(req.user)
                    //console.log(filas)
                    res.send({ok: 'Ok'})
                } else {
                    console.log(err)
                    res.end()
                }
            })
        }
    })
})

app.get('/asignar', ensureAuth, function(req, res) {

    vehiculo.listar('', '', function(err, rows) {
        if(!err) {
            var cabecera = inc(req.user)
            res.render('pages/asignar', {filas:  rows, inc: cabecera})
        } else {
            console.log(err)
        }
    })
})

app.post('/asignar', function(req, res) {
    console.log(req.body)
    var art = {
        id_articulo: req.body.id_articulo,
        nombre: req.body.nombre,
        codigo: req.body.codigo,
        cantidad: req.body.cantidadart,
        minimo: req.body.minimo
    }

    var camion = {
        id_vehiculo: req.body.id_vehiculo
    }

    var cantidad = req.body.cantidad

    articulo.asignar(art, camion, cantidad, function(err, rows) {
        if(!err) {
            if((art.cantidad - cantidad) <= art.minimo ) {
                bot.sendMessage(151423105, 'Stock igual o por debajo del mínimo en '+ art.nombre.toUpperCase())
            }
            articulo.updateCantidad(-cantidad, {id_articulo: req.body.id_articulo},function(err, rows) {
                console.log('HOla mundoh')
            })
            res.send({})
        }
    })
})

app.get('/medidas/alta', ensureAuth, function(req, res) {
    var cabecera = inc(req.user)
    res.render('pages/altamedidas', {inc: cabecera})
})

app.post('/medidas', function(req, res) {
    medida.alta({medida: req.body.medida, abreviatura: req.body.abreviatura}, function(err, rows) {
        res.redirect('/medidas/alta')
    })
})

app.get('/medidas/listar', function(req, res) {
    medida.listar('', '', function(err, rows) {
        if(!err) {
            var cabecera = inc(req.user)
            var filas = rows
            //console.log(filas)
            res.render('pages/medidas-listar', {filas: rows, inc: cabecera})
        } else {
            console.log(err)
            res.end()
        }medida
    })
})

app.get('/medidas/delete/:id', function(req, res) {
    id = req.params.id
    medida.getById(id, function(err, rows) {
        if(!err) {
            //console.log(rows)
            var cabecera = inc(req.user)
            res.render('pages/medidas-confirm', {metro: rows[0] , inc: cabecera})
        }
    })



})

app.post('/medidas/delete/:id', function(req, res) {
    id = req.params.id
    medida.baja(id, function(err, rows) {
        if(!err) {
            medida.listar('', '', function(err, lineas) {
                if(!err) {
                    var cabecera = inc(req.user)
                    //console.log(filas)
                    res.send({ok: 'Ok'})
                } else {
                    console.log(err)
                    res.end()
                }
            })
        }
    })
})

app.get('/medidas/edit/:id', function(req, res) {
    id = req.params.id
    medida.getById(id, function(err, rows) {
        if(!err) {
            //console.log(rows)
            var cabecera = inc(req.user)
            res.render('pages/medidas-edit', {metro: rows , inc: cabecera})
        }
    })


})

app.post('/medidas/edit/:id', function(req, res) {

        var metro = {medida: req.body.medida, abreviatura: req.body.abreviatura}
        medida.update(req.params.id, metro, function(err, filas) {
            if(!err) {

                medida.listar('', '', function(err, lineas) {
                    if(!err) {
                        var cabecera = inc(req.user)
                        //console.log(filas)
                        res.render('pages/medidas-listar', {filas: lineas, inc: cabecera})
                    } else {
                        console.log(err)
                        res.end()
                    }
                })
            } else {
                console.log(err)
            }
        })


})


app.listen(8000, function() {
    console.log('Escuchando el puerto 8000')
})
