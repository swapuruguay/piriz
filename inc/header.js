
var inc = function(user) {
    cabecera = `<nav class="navbar navbar-default">
        <div class="navbar-header">
            <button class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="" class="navbar-brand">JP</a>
        </div>

        <form class="navbar-form pull-right" role="search">
            <a href="/logout" class="btn btn-info">
                <span class="glyphicon glyphicon-log-out"></span> Cerrar
            </a>
          </form>
            <p class="navbar-text pull-right" >Bienvenido ${user.nombre} ${user.apellido}</p>

        <div class="collapse navbar-collapse" id="menu">
            <ul class="nav navbar-nav">
                <li><a href="/"><span class="glyphicon glyphicon-home"></span> Inicio</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">Medidas
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="/medidas/alta">Alta</a></li>
                        <li><a href="/medidas/listar">Listar</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">Veh&iacute;culos
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="/vehiculos/alta">Alta</a></li>
                        <li><a href="/vehiculos/listar">Listar</a></li>
                    </ul>
                </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">Art&iacute;culos
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="/articulos/alta">Alta</a></li>
                            <li><a href="/articulos/compra">Agregar</a></li>
                            <li><a href="/articulos/listar">Listar</a></li>
                            <li><a href="/asignar">Asignar</a></li>
                        </ul>
                    </li>
            </ul>


        </div>


    </nav>`
    return cabecera
}

module.exports.cabecera = inc
