"use strict";
var base = "http://localhost:3000/api/";
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
    pdfs: base + 'admin/upload',
    notifyAll: function (eventId) {
        return base + 'event/' + eventId + '/notify/all';
    },
    notify: function (eventId) {
        return base + 'event/' + eventId + '/notify';
    }
};
//# sourceMappingURL=constants.js.map