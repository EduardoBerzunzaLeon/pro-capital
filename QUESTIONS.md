# Una localidad tiene muchas carpetas
y estas carpetas pueden estar en la misma ruta o en diferentes rutas
- Se cambia la REGION por Carpeta
# En la renovacion se puede cambiar de aval, puede cambiar todo
pero ponerle toda la ifnromacion y que el capturista decida si cambia o no

Descarga de abono y cobranzas

Filtrar por ultima fecha de pago o cobro
para poder obtener todas las clientas de un periodo que no pagaron o pagaron incompleto

# los folios solo son para cuentas atrasadas
# los folios son solo cuanto  no pagan o pagan incompleto
# En la tabla maestra sera el ultimo folio si no tiene entonces queda vacio

# Cuales seran las columnas iniciales, recomendacion no mas de 6 (las acciones son obligatorias)

# es necesario que en la tabla maestra se muestre el domicilio del cliente y el aval y las referencias. (Es mucha informacion en una sola tabla).

# Si una persona renueva, en la tabla principal ¿se mostrara los dos registros, el que ya liquido y el renovado?, o solo muestro el último credito solicitado.

# Me gustaria antes de empezar a ya meter la base de datos que vengan una o varias capturistas y den su retroalimentacion

# Campos

     Definir las entidades participantes
        1.- Seguridad
            1.1 .- Roles: Administrativos, CAPTURISTAS, ASESORES
            1.2 .- Modulos
            1.3 .- Permisos
        
        2.- Usuarios
            Nombre
            apellido Uno
            apellido Dos
            direccion
            Sexo
            curp
            rfc
            Telefono
            Role
            Foto
            Puesto
        
        3.- Agentes
            rutas (cada dia) A una ruta se le puede asignar dos agentes y a un agente se le puede dar dos rutas
            clientes (altas)
            clientes (cobros) cada cliente solo se le asigna un  asesor

        4.- Rutas
            localidad - ejemplo: tenabo1, champoton, xpujil 2
                La poblado puede cambiar de ruta.
                las carpetas puedem cambiar de ruta
                Que movimientos hay con respecto a las carpetas
                    Cancelarlas
                    cerrar 
                    Crearlas estado, municipio, lider, locadalidad,
                    Moverlas de ruta
                Las lideres se pueden cambiar
                Grupo
                    Cada cuanto crean un grupo
                    se crea cada semana si y solo si tiene altas
                    Nunca se le da de alta un cliente los sabados.
                    ustedes todos los dias imprimen una carpeta con el nuevo grupo
                    en el sistema se tendria que crear
                    cada dia es un grupo diferente pero si por ejemplo hoy toco capturar en
                    china pero una persona dijo que mañana
                    y mañana voy y la capturo es un nuevo grupo o es el grupo de ayer?

filtro por curp
    5.- Clientes
        garantia del cliente
        garantia del aval
        Referencia
        referencia aval
        nombre 
        apellido uno
        apellido dos
        nombre aval
        apellido uno aval
        apellido dos aval
        curp
        curp aval
        domicilio 
        domicilio aval
        municipio
        localidad
        carpeta
        grupo
        folio (el folio es diferente para cada pago o es el mismo) - solo para pagos atrasados
        fecha de alta de la deuda
        fecha del proximo pago - una seman despues
        deuda actual
        deuda total
        puede renovar


        En la seccion de ver historial mostrar el grupo y la carpeta
        Si tiene un pago incompleto se pone en estatus vencido pero si mas adelante se recupera y paga todo lo que debe hasta la fecha
        se cambia a estatus activo
        si en la semana 10 pago lo que debio aunque no constante aun asi tiene derecho a renovacion
    

# Preguntas

    Clientes
        Algun filtro mas?
        La eliminacion de un cliente unicamente es validad si y solo si el cliente no a tenido ningun pago
        La modificacion del monto de la deuda y de sus semanalidades solo se pueden modificial si no ha tenido ningun pago
        (Se puede dar el caso cuando la deuda esta mal y capturan menos darle una opcion al pago de observaciones)
        guardar un historico de los montos por que en la semana 5 se puede dar cuenta que no eran 3500 si no 4000
        y se tiene que guardar ambos montos

        cuando renueva una cliente, siempre es el mismo aval o se ha dado el caso de que cambien de aval
        puede haber el mismo aval entre varias clientas
        se ha dado el caso que el importe cambie que cuando se da de alta con 3500 y 300 semanales
        y luego digan hijole eran 3800 y 350 semanales pero ya con un pago cobrado

        Como manejan el reporte de cobranza es cada semana o cada cuanto, o  como determinan los registros
        tengo una idea en el modulo de clientes
        con los que tengas filtrados y seleccionados puedas darle opcion descargar reporte de cobranza y vamonos haga el excel de todas
        las personas con creditos pero si es su segundo credito solo mostraria el ultimo credito

        En la opcion renovar necesita otro campo
        un usuario como una capturista una agente puede pedir un prestamo y si puede
        si se puede dar de alta a los usuarios como clientes
        si es usuario son 12 semanas, si es lider son 10, si es gente son 15 semanas
        una lider es un usuario del sistema? no


        Que pasa con las deudas pasadas
        Volverme a explicar eso de modificacion de importe de pago de una semana
        que se pueda modificar si y solo si unicamente a pasado una semana desde el pago erroneo
        los administradores podran modifiar los importes de pago y el importe total de la deuda
        cada paga el sistema lo calculo a partir del dia de alta + 7 dias es el primer pago
        ahora con esa premisa que pasa si paga en 7 dias pero luego adelanta el pago 
        el sistema tiene que recalcular los siguientes semanas a aprtir del segundo pago + 7 dias
        o sigue el calendario estipulado
        en ese caso
        pagaria en 3 dias mas 

cuando adelanta pagos si tiene colchon no se pone estatus vencido
        Si adelanta pagos no lleva folio aunque la siguiente semana pague menos
        siempre y cuando sea el importe calculado de la semana
        a las lideres ni a los usuarios que trabajan en la financiera no se le perdona nada en renovaciones

        cuNDO UNA CLIENTA paga liquida
        solohasta la semana 10
        y pide renovar no puede
        hasta que el dia de la semana 10
        caiga 


        En detalle de pago sea pagado, pago incompleto, no pagado, adelanto, liquidacion

        Los cobros son unicamente a un agente 
        o un cobro pueden hacerlo varios agentes



         