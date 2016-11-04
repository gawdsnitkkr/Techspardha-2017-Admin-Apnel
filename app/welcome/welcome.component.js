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
 * Created by varun on 12/10/16.
 */
var core_1 = require('@angular/core');
var participants_service_1 = require('../shared/participants.service');
var event_service_1 = require('../shared/event.service');
var WelcomeComponent = (function () {
    function WelcomeComponent(participantsService, eventService) {
        this.participantsService = participantsService;
        this.eventService = eventService;
    }
    WelcomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        //getting event, participants list
        this.event = this.eventService.getEvent();
        if (!this.event) {
            this.eventService.retrieveEvent()
                .subscribe(function (event) {
                _this.event = event;
                console.log(event);
                _this.eventService.setEvent(event);
            }, function (err) {
                console.log('error occured');
            });
        }
        this.participants = this.participantsService.getParticipants();
        if (!this.participants) {
            this.participantsService.retrieveParticipants()
                .subscribe(function (participants) {
                _this.participants = participants;
                console.log(participants);
                _this.participantsService.setParticipants(participants);
            }, function (err) {
                console.log('error occured');
            });
        }
    };
    WelcomeComponent.prototype.getEvent = function () {
        return this.event;
    };
    WelcomeComponent.prototype.getParticipants = function () {
        return this.participants;
    };
    WelcomeComponent.prototype.sample = function () {
        console.log('ok');
    };
    WelcomeComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/welcome/welcome.component.html'
        }), 
        __metadata('design:paramtypes', [participants_service_1.ParticipantsService, event_service_1.EventService])
    ], WelcomeComponent);
    return WelcomeComponent;
}());
exports.WelcomeComponent = WelcomeComponent;
//# sourceMappingURL=welcome.component.js.map