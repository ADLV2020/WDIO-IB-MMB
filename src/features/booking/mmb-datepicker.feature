Feature: Validación de reango de fechas en cambio de vuelo

    Scenario: Validación de rango de fechas en cambio de vuelo Round-Trip por disrupción
        # ... pasos de acceso a MMB ...
        Given se accede a "pantallaHome"
        And acepta todas las politicas de cookies de Iberia
        And hace click en "Gestión de Reservas" de la pantalla "HOME"
        And hace click en "Con Datos de reserva" de la pantalla "GestionDeReservas"
        When ingresa "TEST" en el campo "Apellido" de la pantalla "GestionDeReservas"
        And ingresa "NM7MS" en el campo "PNR" de la pantalla "GestionDeReservas"
        And hace click en "Acceder a la reserva" de la pantalla "GestionDeReservas"
        Then valida que la URL contiene "#!/disrptn"
        # ... pasos de acceso a MMB ...
        Then valida que el elemento "Opcion cambio fecha" esta visible en la pantalla "ManageMyBooking"
        # 1. Validación inicial (solo vuelo afectado / IDA): desde hoy ("HOY") hasta +30 días del vuelo ("2027-01-03")
        When hace click en "Fecha de IDA" de la pantalla "ManageMyBooking"
        Then valida que el calendario de la pantalla "ManageMyBooking" permite fechas desde "HOY" hasta "2027-01-03"
        And selecciona la fecha "2026-12-05" en el calendario de la pantalla "ManageMyBooking"
        # 2. Activar cambio de ambos vuelos (Round-Trip)
        When marca la casilla "Cambiar la fecha de todos mis vuelos" de la pantalla "ManageMyBooking"
        Then valida que el elemento "Fecha de VUELTA" esta visible en la pantalla "ManageMyBooking"
        # 3. Validación de VUELTA: desde la fecha seleccionada de IDA (2026-12-05) hasta +30 días (2027-02-20)
        When hace click en "Fecha de VUELTA" de la pantalla "ManageMyBooking"
        #Then valida que el calendario de la pantalla "ManageMyBooking" permite fechas desde "2026-12-05" hasta "2027-02-20"
        #And selecciona la fecha "2026-12-15" en el calendario de la pantalla "ManageMyBooking"
        Then valida que el elemento "Buscar vuelos" esta habilitado en la pantalla "ManageMyBooking"
