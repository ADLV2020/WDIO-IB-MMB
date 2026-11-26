Feature: Gestion de Reservas general - MMB

  Scenario: Acceso a consulta de PNR en MMB sin disrupción
    #Given un usuario con PNR "ABC12" y apellido "TEST"
    Given se accede a manage my booking
    Given se accede a "pantallaHome"
    And se accede a manage my booking
    And acepta todas las politicas de cookies de Iberia
    And se accede a manage my booking
    And hace click en "Gestión de Reservas" de la pantalla "HOME"
    #When 
    #And hace click en "Acepatar Modal" de la pantalla "GestionDeReservas"
    And se accede a manage my booking
    #When 
    And hace click en "Con Datos de reserva" de la pantalla "GestionDeReservas"
    When ingresa "TEST" en el campo "Apellido" de la pantalla "GestionDeReservas"
    And ingresa "LM3L9" en el campo "PNR" de la pantalla "GestionDeReservas"
    And hace click en "Acceder a la reserva" de la pantalla "GestionDeReservas"
    #Given se accede a portal
    And se hace click en gestionar
