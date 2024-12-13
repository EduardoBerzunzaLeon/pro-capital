

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
    - añadir el breadcrumb - DONE
    - Acomodar la UI de la seccion de lideres
    - verificar el color de los dialogs
    - cambiar el color de todo la app segun el thema sin necesidad de forzarlo con red-dark
    - ponerle un estilo de loader en el navlink mientras cambia de pagina
    - Cerrar el navlink cuando cargue la otra pagina
    - bug en el cual no pinta el estilo de navlink active cuando entras a una subruta
    - Cambiar de action a loader al momento de descargar el layout
    - Agregar el reporte de excel a todos las tablas - DONE
    - Agregar el boton de autogenerar grupos -DONE
    - Agregar boton de actualizar estatus de creditos - DONE
    - Agregar el reporte de creditos nuevos y faltate - DONE
    - Agregar pagos en credito detalle
    - Agregar tabla dinamica con los pagos en credito detalle.
    - Agregar opcion de eliminar, actualizar pagos en la tabla de credito detalle. - DONE
    - Agregar paginar de pagos en la tabla de *Renovar credito form*
    - Acomodar interfaz de usuario de todas las secciones, verificar que sea responsive
    -- add prettier
    -- Agregar titulo en cada pagina
    -- Agregar folder active autocomplete
    -- Agregar filter input solo numeros
    -- Agregar schema para telefono (cantidad de caracteres)
    -- Agregar la opcion de Matar usuario (marcarlo como fallecido)

# MEMORY LEAK:
  - Cuando se escribe en el input, como cambia la url causa navegación ocasionando que rerenderice el root component, (mande a llamar al usuario, con todos los permisos (pesa demasiado)) [Quizas este listo, verificarlo]

# SERVER
    - Agregar flash message para errores con toast en loader (en el momento de descargar un excel).

# MODULOS FALTANTES:
    - Perfil
        - Ver mi perfil
        - Actualizar mis datos personales

# - ERRROR: 
    Cuando le doy escape ocurre un error
# Opciones de ampliacion
    - Controlar Ataque CSRF: https://github.com/sergiodxa/remix-utils#csrf
    - Hacer un reporte vacio con los datos, 

# TODO: 
    Agregar los pagos y filtro por localidad y grupo en detalle credito 
    Agregar boton "Actualizar estatus de las cuentas" 
    Reporte de excel por fecha de cuentas vencidas, y nuevas cuentas por carpeta
    Agregar boton de "Generar grupos"
    Agregar el estatus a la carpeta
    Definir todos los permisos 
    Definir si un pago en 0 cuenta para recalculo de renovacion

# BUG:
  El monto puede ser 0 al momento de agregar un pago, actualmente no lo permite

# Funcionalidades faltantes: 
    Agregar exportar excel cumpleaños de lideres
    Agregar activar y desactivar folder
        Aplicar esto en el autocomplete [NO es prioritario]
    Mi perfil
    Editar mi perfil
    Agregar paginacion a renovacion de credito, pagos

# QUESTION
    Preguntar si el no pago se toma en cuenta como cantidad de pagos