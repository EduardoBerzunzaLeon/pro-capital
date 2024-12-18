

- Cambiar la libreria de excel file-saver tiene vulnerabilidades
- Agregar Transicion de logout mientras hace el loading

# datos credito formulario


# UI:
    -- Bug en folder ya que lideres es un arreglo, debe traer solo la lider activo
    - Acomodar la UI de la seccion de lideres
    - verificar el color de los dialogs
    - cambiar el color de todo la app segun el thema sin necesidad de forzarlo con red-dark
    - Cambiar de action a loader al momento de descargar el layout
    - Acomodar interfaz de usuario de todas las secciones, verificar que sea responsive
    -- add prettier
    -- Agregar folder active autocomplete
    -- Agregar filter input solo numeros [no urgente]

# MEMORY LEAK:
  - Cuando se escribe en el input, como cambia la url causa navegación ocasionando que rerenderice el root component, (mande a llamar al usuario, con todos los permisos (pesa demasiado)) [Quizas este listo, verificarlo]

# SERVER
    - Agregar flash message para errores con toast en loader (en el momento de descargar un excel).

# - ERRROR: 
    Cuando le doy escape ocurre un error
# Opciones de ampliacion
    - Controlar Ataque CSRF: https://github.com/sergiodxa/remix-utils#csrf
    - Hacer un reporte vacio con los datos, 

# Funcionalidades faltantes: 
        Aplicar esto en el autocomplete [NO es prioritario]
    cuando se use el autocomplete, verificar si trae el isActive si lo trae pintar el chipo de activo / inactivo (Carpeta, Asesor)
    - cuando sea crear si aparezcan solo personas activas o carpetas activas
    - en editar aparezcan todos pero con el estatus

# QUESTION
    Preguntar si el no pago se toma en cuenta como cantidad de pagos

# TODOS: 
    - Verify handler errors
    - fix bugs 
    - upgrade UI
    - Test Deploy
    - Migrate
    - Real deploy