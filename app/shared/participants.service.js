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
/**
 * Created by varun on 1/11/16.
 */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
var constants = require('./constants');
var ParticipantsService = (function () {
    function ParticipantsService(http) {
        this.http = http;
        this.getParticipantsUrl = constants.apis.getParticipants;
    }
    ParticipantsService.prototype.getParticipants = function () {
        return ParticipantsService.participants;
    };
    ParticipantsService.prototype.setParticipants = function (participants) {
        ParticipantsService.participants = participants;
    };
    ParticipantsService.prototype.retrieveParticipants = function () {
        return this.http.post(this.getParticipantsUrl, {}, {})
            .map(function (response) { return response.json(); })
            .catch(function (error) { return Rx_1.Observable.throw(error.json().error || 'Server error'); });
    };
    ParticipantsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ParticipantsService);
    return ParticipantsService;
}());
exports.ParticipantsService = ParticipantsService;
//# sourceMappingURL=participants.service.js.map