"use strict";
var base = "http://anshulmalik.me/api/";
exports.apis = {
    login: base + 'admin/login',
    myEvent: base + 'admin/events',
    getParticipants: function (eventId) {
        return base + 'event/' + eventId + '/participants';
    },
    getEvent: function (eventId) {
        return base + 'event/' + eventId;
    },
    forwardParticipant: function (eventId) {
        return base + 'event/' + eventId + '/forward';
    },
    pdfs: 'http://localhost:3000/api/admin/upload'
};
//# sourceMappingURL=constants.js.map