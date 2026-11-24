Feature: Gestion de Reservas general - MMB

  Scenario: Acceso a consulta de PNR en MMB sin disrupción
    #Given un usuario con PNR "ABC12" y apellido "TEST"
    #And se accede a "pantallaHome"
    #And hace click en "Gestión de Reservas" de la pantalla "HOME"
    #When ingresa "TEST" en el campo "Apellido" de la pantalla "GestionDeReservas"
    #When ingresa "ABC12" en el campo "Ticket" de la pantalla "GestionDeReservas"
    #When hace click en "Gestionar" de la pantalla "GestionDeReservas"
    #Then se accede a la pantalla "ManageMyBooking"
    #And valida el texto literal "Su Reserva para" en la pantalla "ManageMyBooking"
    Given se accede a portal
    And se accede a manage my booking
    When se ingresa el apellido
    And se ingresa el PNR
    And se hace click en gestionar
