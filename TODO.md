

- Cambiar la libreria de excel file-saver tiene vulnerabilidades
- Agregar Transicion de logout mientras hace el loading
# datos credito formulario
    el telefono no es obligatorio si lo dejan vacio el sistema
    pondra 0
    al momento de buscar el aval te diga si es cliente no liquidado
    en los creditos pendientes del aval
    traer carpeta grupo y total de la deuda
    No aceptar decimal


# UI:
    - Agregar el isActive en carpeta y en su tabla crud
    -- Bug en folder ya que lideres es un arreglo, debe traer solo la lider activo
    - Separar la logica de agents Page - falta solo el loader y el rendercell ?
    - separar la logica del autocomplete multiple (Not is required)
    - añadir el breadcrumb
    - Acomodar la UI de la seccion de lideres
    - verificar el color de los dialogs
    - cambiar el color de todo la app segun el thema sin necesidad de forzarlo con red-dark
    - ponerle un estilo de loader en el navlink mientras cambia de pagina
    - Cerrar el navlink cuando cargue la otra pagina
    - bug en el cual no pinta el estilo de navlink active cuando entras a una subruta
    - Cambiar de action a loader al momento de descargar el layout
    - Agregar el reporte de excel a todos las tablas
    - Agregar el boton de autogenerar grupos
    - Agregar boton de actualizar estatus de creditos
    - Agregar el reporte de creditos nuevos y faltate
    - Agregar pagos en credito detalle
    - Agregar tabla dinamica con los pagos en credito detalle.
    - Agregar opcion de eliminar, actualizar pagos en la tabla de credito detalle.
    - Agregar paginar de pagos en la tabla de *Renovar credito form*
    - Acomodar interfaz de usuario de todas las secciones, verificar que sea responsive
    -- add prettier
    -- Agregar titulo en cada pagina
    -- Agregar folder active autocomplete
    -- Agregar filter input solo numeros
    -- Agregar schema para telefono (cantidad de caracteres)
    -- Agregar la opcion de Matar usuario (marcarlo como fallecido)

# MODULOS FALTANTES:
    - Usuarios:
        - Agregar Usuario (Subir archivos - NEW)
        - Actualizar Usuario (Incluye el Role)
        - Desactivar Usuario (soft delete)
        - Ver Usuarios
        - Filtros de Usuarios
    - Perfil
        - Ver mi perfil
        - Actualizar mis datos personales
    - Asignar Permisos a Roles
        - Ver todos los roles
        - Ver todos los permisos
        - Asigar que permisos le pertenece a que rol
            - Seleccionara el ROl, entonces le apareceran todos los permisos que existen
                en el sistema, divido por secion / modulo, seran muchos checkboxes, el administrador
                marcara y desmarcara los permisos segun el rol.

# SERVER:
    - Agregar el user repository y service


# - ERRROR: 
    Cuando le doy escape ocurre un error
# Opciones de ampliacion
    - Controlar Ataque CSRF: https://github.com/sergiodxa/remix-utils#csrf
    - Hacer un reporte vacio con los datos, 

# TODO: 
    Agregar contador de pagos en tablas de credito - DONE
    Agregar contador de pagos en la actualizacion de datos - DONE
    Agregar pago en historial de pago y en detalle credito - DONE
    Agregar los pagos y filtro por localidad y grupo en detalle credito 
    Agregar boton "Actualizar estatus de las cuentas" 
    Reporte de excel por fecha de cuentas vencidas, y nuevas cuentas por carpeta
    Agregar boton de "Generar grupos"
    Agregar el estatus a la carpeta
    Definir todos los permisos 