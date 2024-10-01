

- Cambiar la libreria de excel file-saver tiene vulnerabilidades
- Agregar Transicion de logout mientras hace el loading
# datos credito formulario
    el telefono no es obligatorio si lo dejan vacio el sistema
    pondra 0
    al momento de buscar el aval te diga si es cliente no liquidado
    en los creditos pendientes del aval
    traer carpeta grupo y total de la deuda
    No aceptar decimal


#order
    telefono
    direccion
    referencia
    garantia
# UI:
    - Agregar el isActive en carpeta y en su tabla crud
    -- Bug en folder ya que lideres es un arreglo, debe traer solo la lider activo
    - Separar la logica de agents Page - falta solo el loader y el rendercell ?
    - separar la logica del autocomplete multiple
    - añadir el breadcrumb
    - Acomodar la UI de la seccion de lideres
    - verificar el color de los dialogs
    - cambiar el color de todo la app segun el thema sin necesidad de forzarlo con red-dark
    - ponerle un estilo de loader en el navlink cuando cambia de pagina
    -- add prettier
    -- Agregar titulo en cada pagina
    -- Agregar conform en auto completes
    -- Agregar folder active autocomplete
    -- Agregar filter input solo numeros
    -- Agregar schema para telefono (cantidad de caracteres)

    

# SERVER:
    - Agregar el user repository y service


# - ERRROR: 
    Cuando le doy escape ocurre un error
# Opciones de ampliacion
    - Controlar Ataque CSRF: https://github.com/sergiodxa/remix-utils#csrf
    - Hacer un reporte vacio con los datos, 

# NOTES 
    - Puede renovar siempre y cuando llegue al monto del pago numero 10 
    - Si tiene algun retrazo en algun pago no se le condena ningun pago

