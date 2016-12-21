"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
var constants = require('./constants');
var session_service_1 = require('./session.service');
var EventService = (function () {
    function EventService(http, sessionService) {
        this.http = http;
        this.sessionService = sessionService;
    }
    EventService.prototype.getEvent = function () {
        return EventService.event;
    };
    EventService.prototype.setEvent = function (event) {
        EventService.event = event;
    };
    EventService.prototype.retrieveEventId = function () {
        var params = new http_1.URLSearchParams();
        params.set('token', this.sessionService.getAdmin().token);
        return this.http.get(constants.apis.myEvent, { search: params })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return Rx_1.Observable.throw(error.json().error || 'Server error'); });
    };
    EventService.prototype.retrieveEvent = function (id) {
        return this.http.get(constants.apis.getEvent(id))
            .map(function (response) { return response.json(); })
            .catch(function (err) { return Rx_1.Observable.throw(err.json().err || 'Server error'); });
    };
    EventService.prototype.updateEvent = function (eventId, event, token) {
        event.token = token;
        return this.http.post(constants.apis.getEvent(eventId), event)
            .map(function (response) { return response.json(); })
            .catch(function (err) { return Rx_1.Observable.throw(err.json().arr || 'Server error'); });
    };
    EventService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, session_service_1.SessionService])
    ], EventService);
    return EventService;
}());
exports.EventService = EventService;
//# sourceMappingURL=event.service.js.map