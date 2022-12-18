import flatpickr from "flatpickr";

flatpickr('.flatpickr.js-flatpickr-dateTime', {
    enableTime: true,
    time_24hr: true,
    altInput: true,
    altFormat: 'd M Y H:i',
    dateFormat: 'Y-m-d H:i'
})