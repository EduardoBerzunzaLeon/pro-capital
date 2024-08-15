

- Cambiar la libreria de excel file-saver tiene vulnerabilidades
- Agregar Transicion de logout mientras hace el loading


# CRUD
    - Validar el loading en tablas
    - proteger la ruta del loader de municipality, solo entrar por medio del fetcher
    - cambiar la rura de municipality para que no este en raiz app
    - Si borras todos los registros de la ultima pagina el paginador se apendeja y
    renderiza mal las paginas- revisar
    - si tienes un toast activo y entras a otro menu y vuelves a entrar a rutas se reactiva el modal - revisar
   - Agregar el case sentitive del nombre
   - Agregar validaciones con ZOD que no pueda ingresar letras ni caracteres raros al nombre
   - Crear un handler pagination en el servidor
   - Separar el layout en componentes
   - verificar el handler error 
   - verificar los retornos de error y de exito para evitar poner siempre un
   json({mesage: 'actualizado'}, 201);
   - mejorar el estilo


# Opciones de ampliacion
    - Controlar Ataque CSRF: https://github.com/sergiodxa/remix-utils#csrf