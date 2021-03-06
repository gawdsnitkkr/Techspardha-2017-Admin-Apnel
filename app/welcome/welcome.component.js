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
var core_1 = require("@angular/core");
var participants_service_1 = require("../shared/participants.service");
var event_service_1 = require("../shared/event.service");
var session_service_1 = require("../shared/session.service");
var upload_service_1 = require("../services/upload.service");
var alert_service_1 = require("../services/alert.service");
var notification_service_1 = require("../services/notification.service");
var authentication_service_1 = require("../services/authentication.service");
var constants = require("../shared/constants");
var WelcomeComponent = (function () {
    function WelcomeComponent(participantsService, eventService, alertService, sessionService, uploadService, notificationService, authenticationService) {
        var _this = this;
        this.participantsService = participantsService;
        this.eventService = eventService;
        this.alertService = alertService;
        this.sessionService = sessionService;
        this.uploadService = uploadService;
        this.notificationService = notificationService;
        this.authenticationService = authenticationService;
        this.eventActiveClass = 'event-active';
        this.responseActiveClass = '';
        this.showTabContent = 'event';
        this.uploadService.progress$.subscribe(function (progress) {
        }, function (err) {
            _this.alertService.clear();
            _this.alertService.error('upload error', "Error uploading the file");
        });
    }
    WelcomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.event = this.eventService.getEvent();
        this.oneModal.onOpen.subscribe(function (id) {
            _this.curInviteId = id[0];
        });
        if (!this.event) {
            this.alertService.wait("Please wait while we fetch event details", "Loading events");
            this.eventService.retrieveEventId()
                .subscribe(function (event) {
                _this.alertService.clear();
                _this.eventId = event.data[0];
                _this.fetchAndUpdateEvent();
                _this.fetchAndUpdateParticipants();
            }, function (err) {
                _this.alertService.clear();
                console.log('error occured');
            });
        }
        this.admin = this.sessionService.getAdmin();
    };
    WelcomeComponent.prototype.fetchAndUpdateEvent = function () {
        var _this = this;
        // Fetches event details
        this.eventService.retrieveEvent(this.eventId)
            .subscribe(function (event) {
            if (event.status.code === 200) {
                if (event.data.Start) {
                    event.data.Start = _this.toDateString(new Date(event.data.Start));
                }
                if (event.data.End) {
                    event.data.End = _this.toDateString(new Date(event.data.End));
                }
                _this.event = event.data;
            }
            else {
                _this.alertService.error(event.status.message);
            }
        }, function (err) {
            _this.alertService.clear();
            _this.alertService.error("Error occured, contact gawds");
        });
    };
    WelcomeComponent.prototype.fetchAndUpdateParticipants = function () {
        var _this = this;
        // Fetches participants of the event
        this.participants = undefined;
        this.alertService.wait("Please wait while participants are being fetched", "Fetching Participants");
        this.participantsService.retrieveParticipants(this.eventId)
            .subscribe(function (response) {
            if (response.status.code === 200) {
                _this.alertService.clear();
                _this.alertService.success("Participants updated");
                _this.participants = response.data.map(function (participant) {
                    if (participant.Student) {
                        return {
                            Name: participant.Student.Name,
                            Level: participant.CurrentRound,
                            Email: participant.Student.Email,
                            College: participant.Student.Details.College,
                            Mobile: participant.Student.Details.PhoneNumber
                        };
                    }
                    else if (participant.Team) {
                        return {
                            Name: participant.Team.Name,
                            Id: participant.Team.Id,
                            Level: participant.CurrentRound,
                            College: participant.Team.TeamLeader.Details.College,
                            Mobile: participant.Team.TeamLeader.Details.PhoneNumber
                        };
                    }
                });
                _this.sortParticipants();
                _this.participantsService.setParticipants(_this.participants);
            }
        }, function (err) {
            _this.alertService.clear();
            _this.alertService.error("Error occured, contact gawds");
            console.log('Error while fetch and update participants', err);
        });
    };
    WelcomeComponent.prototype.getEvent = function () {
        return this.event;
    };
    WelcomeComponent.prototype.getParticipants = function () {
        return this.participants;
    };
    WelcomeComponent.prototype.onResponseButtonClick = function () {
        this.responseActiveClass = 'response-active';
        this.eventActiveClass = '';
        this.showTabContent = 'response';
    };
    WelcomeComponent.prototype.onEventButtonClick = function () {
        this.responseActiveClass = '';
        this.eventActiveClass = 'event-active';
        this.showTabContent = 'event';
    };
    WelcomeComponent.prototype.updateStatus = function () {
    };
    WelcomeComponent.prototype.updateEvent = function () {
        var _this = this;
        // When update event button is clicked, validate form and
        // upload the changes
        var payload = JSON.parse(JSON.stringify(this.event));
        ;
        var s = new Date(this.event.Start);
        var e = new Date(this.event.End);
        var errMsg = '';
        if (isNaN(s.getDate()))
            errMsg = 'Start date is undefined';
        else if (isNaN(e.getDate()))
            errMsg = 'End date is undefined';
        else if (this.event.Description.length < 1)
            errMsg = 'Please write some description';
        else if (this.event.Rules.length < 1)
            errMsg = 'Please write rules for the event';
        else if (this.event.Venue.length == 0)
            errMsg = 'Please specify venue for the event';
        else if (!this.event.MaxContestants)
            errMsg = 'Plese specify maxiumum number of contestants per team';
        else if (this.event.CurrentRound == undefined)
            errMsg = 'Please specify current round of the event';
        else if (this.event.TotalRounds == undefined)
            errMsg = 'Please specify total number of rounds';
        else {
            // No errors, post request
            payload.Start = this.convertDate(payload.Start);
            payload.End = this.convertDate(payload.End);
            this.alertService.wait("Pushing the changes", "Uploading");
            this.eventService.updateEvent(this.eventId, payload, this.admin.token).subscribe(function (response) {
                if (response.status.code === 200) {
                    _this.alertService.clear();
                    _this.alertService.success("Successfully updated");
                }
            }, function (err) {
                _this.alertService.error("Something went wrong, contact gawds");
                console.log("error occured", err);
            });
        }
        if (errMsg.length) {
            this.alertService.error(errMsg);
        }
    };
    WelcomeComponent.prototype.forwardParticipant = function (index, id) {
        var _this = this;
        // Move participants to next level
        this.alertService.wait("To the next level", "Forwarding...");
        this.participantsService.forwardParticipant(this.eventId, id)
            .subscribe(function (response) {
            _this.alertService.clear();
            if (response.status.code === 200) {
                _this.alertService.success("Successfully forwarded");
                _this.participants[index].Level++;
                _this.sortParticipants();
            }
            else {
                _this.alertService.clear();
                _this.alertService.error(response.status.message);
            }
        }, function (err) {
            _this.alertService.clear();
            _this.alertService.error("Something went wrong, contact gawds");
            console.log('Error occured', err);
        });
    };
    WelcomeComponent.prototype.backwardParticipant = function (index, id) {
        var _this = this;
        // Move participants to next level
        this.alertService.wait("Taking back", "Processing...");
        this.participantsService.backwardParticipant(this.eventId, id)
            .subscribe(function (response) {
            _this.alertService.clear();
            if (response.status.code === 200) {
                _this.alertService.success("Successfully processed");
                _this.participants[index].Level--;
                _this.sortParticipants();
            }
            else {
                _this.alertService.clear();
                _this.alertService.error(response.status.message);
            }
        }, function (err) {
            _this.alertService.clear();
            _this.alertService.error("Something went wrong, contact gawds");
            console.log('Error occured', err);
        });
    };
    WelcomeComponent.prototype.sortParticipants = function () {
        // Arrange participants according to current round
        // Participants in current round on top
        this.participants = this.participants.sort(function (first, second) {
            return first.Level - second.Level;
        });
    };
    WelcomeComponent.prototype.logout = function () {
        this.sessionService.logout();
    };
    WelcomeComponent.prototype.fileChanged = function (event) {
        var _this = this;
        // Uploads the file to server
        this.alertService.wait("Please wait while pdf is being uploaded", "Uploading");
        var files = event.srcElement.files;
        this.uploadService.makeFileRequest(constants.apis.pdfs, this.admin.token, files).subscribe(function (response) {
            _this.alertService.clear();
            if (response.status.code == 200) {
                _this.event.Pdf = "http://techspardha.org/api/static/" + response.data.filename;
                _this.alertService.success("File uploaded successfully, hit update to save the details");
            }
            else {
                _this.alertService.error(response.data, "Upload failed");
            }
        }, function (err) {
            console.log(err);
            _this.alertService.error(err, "Contact gawds");
        });
    };
    WelcomeComponent.prototype.notifyAll = function () {
        var _this = this;
        this.alertService.wait("Please wait while we are notifying participants", "Notifying all participants");
        var msg = this.notiMessage;
        this.notificationService.notify(this.event.Id, 'all', msg, this.admin.token).subscribe(function (response) {
            _this.alertService.clear();
            if (response.status.code === 200) {
                _this.alertService.success('Notified');
                _this.notiMessage = '';
            }
            else {
                _this.alertService.error(response.status.message);
            }
        }, function (err) {
            _this.alertService.clear();
            _this.alertService.error("Contact gawds to resolve the error");
            console.log(err);
        });
    };
    WelcomeComponent.prototype.notifyOne = function () {
        var _this = this;
        this.alertService.wait("Please wait while we are notifying participants", "Notifying all participants");
        var msg = this.notiMessage;
        this.notificationService.notify(this.event.Id, 'current', msg, this.admin.token, [this.curInviteId]).subscribe(function (response) {
            _this.alertService.clear();
            if (response.status.code === 200) {
                _this.alertService.success('Notified');
                _this.notiMessage = '';
            }
            else {
                _this.alertService.error(response.status.message);
            }
        }, function (err) {
            _this.alertService.clear();
            _this.alertService.error("Contact gawds to resolve the error");
            console.log(err);
        });
    };
    WelcomeComponent.prototype.toDateString = function (date) {
        return (date.getFullYear().toString() + '-'
            + ("0" + (date.getMonth() + 1)).slice(-2) + '-'
            + ("0" + (date.getDate())).slice(-2))
            + 'T' + date.toTimeString().slice(0, 5);
    };
    WelcomeComponent.prototype.convertDate = function (d) {
        d = new Date(d);
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * '+0.0'));
    };
    WelcomeComponent.prototype.changePassword = function () {
        var _this = this;
        console.log(this.chPass);
        this.alertService.wait('Please wait...', 'Changing password');
        if (this.chPass) {
            this.authenticationService.changePassword(this.admin.token, this.chPass).subscribe(function (response) {
                _this.alertService.clear();
                if (response.status.code == 200) {
                    _this.alertService.success('Password changed successfully');
                }
                else {
                    _this.alertService.error(response.status.message);
                }
            }, function (err) {
                console.log(err);
                _this.alertService.error("Please check your internet connection");
            });
        }
    };
    return WelcomeComponent;
}());
__decorate([
    core_1.ViewChild('oneModal'),
    __metadata("design:type", Object)
], WelcomeComponent.prototype, "oneModal", void 0);
WelcomeComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/welcome/welcome.component.html',
        providers: [upload_service_1.UploadService, authentication_service_1.AuthenticationService]
    }),
    __metadata("design:paramtypes", [participants_service_1.ParticipantsService,
        event_service_1.EventService,
        alert_service_1.AlertService,
        session_service_1.SessionService,
        upload_service_1.UploadService,
        notification_service_1.NotificationService,
        authentication_service_1.AuthenticationService])
], WelcomeComponent);
exports.WelcomeComponent = WelcomeComponent;
//# sourceMappingURL=welcome.component.js.map