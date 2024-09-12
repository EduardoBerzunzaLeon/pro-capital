

- Cambiar la libreria de excel file-saver tiene vulnerabilidades
- Agregar Transicion de logout mientras hace el loading


# UI:
    - Agregar el isActive en carpeta y en su tabla crud
    -- Bug en folder ya que lideres es un arreglo, debe traer solo la lider activa
    - Separar la logica de agents Page
    - Crear componentes filters
    - Verificar si es factible crear un componente tabla generica
    - separar la logica del autocomplete multiple
    - añadir el breadcrumb
    - Cambiar el ROW PER PAGE por un select de nextui
    - Solucionar el bug donde si recargo la pagina pero cambie el row per page no se modifica
    - Cambiar el idioma en los calendarios
    - Acomodar la UI de la seccion de lideres
    - verificar el color de los dialogs
    - cambiar el color de todo la app segun el thema sin necesidad de forzarlo con red-dark
    - ponerle un estilo de loader en el navlink cuando cambia de pagina
    -- add prettier
    

# SERVER:
    - Agregar el user repository y service

# Opciones de ampliacion
    - Controlar Ataque CSRF: https://github.com/sergiodxa/remix-utils#csrf