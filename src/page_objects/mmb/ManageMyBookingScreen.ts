// src/page_objects/mmb/ManageMyBookingScreen.ts

import { BaseScreen } from '@page_objects/base/BaseScreen';

export class ManageMyBookingScreen extends BaseScreen {
  screenName = 'ManageMyBooking';
  aliasesMap: Record<string, string> = {
    // Disrupción y Reembolso
    'titulo': 'titleHeader',
    'mensaje disrupcion': 'disruptionMessage',
    'lo sentimos': 'disruptionMessage',
    'aceptar': 'acceptChangesBtn',
    'aceptar cambios': 'acceptChangesBtn',
    'solicitar': 'requestRefundBtn',
    'solicitar reembolso': 'requestRefundBtn',
    'texto reembolso': 'refundOptionsText',
    'opciones reembolso': 'refundOptionsText',

    // Cambio de fecha/hora (Vuelos)
    'opcion cambio fecha': 'flightChangeOptionTitle',
    'limite cambio vuelo': 'flightChangeLimitText',
    'fecha de ida': 'departureDateTrigger',
    'fecha de vuelta': 'returnDateTrigger',
    'buscar vuelos': 'searchFlightsBtn',
    'cambiar la fecha de todos mis vuelos': 'changeAllFlightsCheckbox',
    'ciudades cercanas': 'sisterCitiesCheckbox',

    // Controles internos del Calendario (uib-datepicker)
    'calendario': 'datepickerPopup',
    'mes siguiente': 'datepickerNextMonthBtn',
    'mes anterior': 'datepickerPreviousMonthBtn',
    'titulo mes calendario': 'datepickerMonthTitle',

    // Cookies
    'banner cookies': 'cookiesBanner',
    'aceptar cookies': 'acceptCookiesBtn'
  };

}
