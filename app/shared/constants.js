"use strict";
var base = "http://techspardha.org/api/";
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
    backwardParticipant: function (eventId) {
        return base + 'event/' + eventId + '/backward';
    },
    pdfs: base + 'admin/upload',
    notifyAll: function (eventId) {
        return base + 'event/' + eventId + '/notify/all';
    },
    notify: function (eventId) {
        return base + 'event/' + eventId + '/notify';
    },
    changePassword: base + 'admin/change-password'
};
//# sourceMappingURL=constants.js.map