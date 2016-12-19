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
var participants_service_1 = require('../shared/participants.service');
var event_service_1 = require('../shared/event.service');
var session_service_1 = require('../shared/session.service');
var upload_service_1 = require('../services/upload.service');
var ng2_toasty_1 = require('ng2-toasty');
var WelcomeComponent = (function () {
    function WelcomeComponent(participantsService, eventService, sessionService, uploadService, toastyService, toastyConfig) {
        var _this = this;
        this.participantsService = participantsService;
        this.eventService = eventService;
        this.sessionService = sessionService;
        this.uploadService = uploadService;
        this.toastyService = toastyService;
        this.toastyConfig = toastyConfig;
        this.toastyConfig.theme = 'material';
        this.toastyConfig.showClose = true;
        this.responseActiveClass = 'response-active';
        this.eventActiveClass = '';
        this.showTabContent = 'response';
        this.classes = {
            'desc': 'valid',
            'rules': 'valid',
            'start': 'valid',
            'end': 'valid',
            'venue': 'valid',
            'mc': 'valid',
            'file': 'valid'
        };
        this.uploadService.progress$.subscribe(function (progress) {
            if (progress === 100) {
                _this.toastyService.clear(_this.currentToastId);
                _this.toastyService.success({
                    title: "Done",
                    msg: "File uploaded successfully, hit update to save the details",
                    timeout: 5000,
                });
            }
        });
    }
    WelcomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.event = this.eventService.getEvent();
        if (!this.event) {
            this.eventService.retrieveEventId()
                .subscribe(function (event) {
                _this.eventId = event.data[0];
                _this.fetchAndUpdateEvent();
                _this.fetchAndUpdateParticipants();
            }, function (err) {
                console.log('error occured');
            });
        }
        this.admin = this.sessionService.getAdmin();
    };
    WelcomeComponent.prototype.fetchAndUpdateEvent = function () {
        var _this = this;
        this.eventService.retrieveEvent(this.eventId)
            .subscribe(function (event) {
            if (event.status.code === 200) {
                if (event.data.Start) {
                    event.data.Start = new Date(event.data.Start).toLocaleString();
                }
                if (event.data.End) {
                    event.data.End = new Date(event.data.End).toLocaleString();
                }
                _this.event = event.data;
            }
            else {
            }
        });
    };
    WelcomeComponent.prototype.fetchAndUpdateParticipants = function () {
        var _this = this;
        this.participantsService.retrieveParticipants(this.eventId)
            .subscribe(function (response) {
            if (response.status.code === 200) {
                _this.participants = response.data.map(function (participant) {
                    if (participant.Student) {
                        return {
                            Id: participant.Student.Id,
                            Name: participant.Student.Name,
                            Level: participant.CurrentRound,
                            Email: participant.Student.Email
                        };
                    }
                    else if (participant.Team) {
                    }
                });
                _this.sortParticipants();
                _this.participantsService.setParticipants(_this.participants);
            }
        }, function (err) {
            console.log('Error while fetch and update participants');
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
        var s = new Date(this.event.Start);
        var e = new Date(this.event.End);
        if (isNaN(s.getDate()) ||
            isNaN(e.getDate()) ||
            this.event.Description.length < 10 ||
            this.event.Rules.length < 10 ||
            this.event.Venue.length == 0 ||
            !this.event.MaxContestants ||
            !this.event.CurrentRound ||
            this.event.Pdf.length == 0) {
            this.toastyService.error({
                title: "Error",
                msg: "Please correct the red boxes",
                showClose: true,
                timeout: 3000,
            });
        }
        else {
            // No errors, post request
            this.toastyService.wait({
                title: "Uploading",
                msg: "Pushing the changes",
                timeout: 60000,
                onAdd: function (toast) {
                    this.currentToastId = toast.id;
                },
            });
            this.eventService.updateEvent(this.eventId, this.event, this.admin.token).subscribe(function (response) {
                console.log(response);
                if (response.status.code === 200) {
                    _this.toastyService.clear(_this.currentToastId);
                    _this.toastyService.success({
                        title: "Success",
                        msg: "Successfully updated",
                        timeout: 3000
                    });
                }
            }, function (err) {
                _this.showErrorToast("Can't connect to internet");
                console.log("error occured", err);
            });
        }
    };
    WelcomeComponent.prototype.forwardParticipant = function (index, id) {
        var _this = this;
        this.toastyService.wait({
            title: "Forwarding...",
            msg: "To the next level",
            showClose: true,
            timeout: 20000,
            onAdd: function (toast) {
                this.currentToastId = toast.id;
            }
        });
        this.participantsService.forwardParticipant(this.eventId, id)
            .subscribe(function (response) {
            _this.toastyService.clear(_this.currentToastId);
            if (response.status.code === 200) {
                _this.showSuccessToast("Successfully forwarded");
                _this.participants[index].Level++;
                _this.sortParticipants();
            }
            else {
            }
        }, function (err) {
            _this.showErrorToast("Can't connect to internet");
            console.log('Error occured');
        });
    };
    WelcomeComponent.prototype.sortParticipants = function () {
        this.participants = this.participants.sort(function (first, second) {
            return first.Level - second.Level;
        });
    };
    WelcomeComponent.prototype.logout = function () {
        this.sessionService.logout();
    };
    WelcomeComponent.prototype.fileChanged = function (event) {
        var _this = this;
        this.toastyService.wait({
            title: "Uploading",
            msg: "Please wait while pdf is being uploaded",
            showClose: true,
            timeout: 60000,
            onAdd: function (toast) {
                this.currentToastId = toast.id;
            }
        });
        var files = event.srcElement.files;
        console.log(files);
        this.uploadService.makeFileRequest('http://localhost:3000/api/admin/upload', this.admin.token, files).subscribe(function (data) {
            if (data) {
                _this.event.Pdf = "http://google.com/" + data[0].filename;
            }
        });
    };
    WelcomeComponent.prototype.validate = function (obj) {
        switch (obj) {
            case 'desc':
                if (this.event.Description.length)
                    this.classes.desc = 'valid';
                else
                    this.classes.desc = 'invalid';
                break;
            case 'rules':
                if (this.event.Rules.length)
                    this.classes.rules = 'valid';
                else
                    this.classes.rules = 'invalid';
                break;
            case 'venue':
                if (this.event.Venue.length)
                    this.classes.venue = 'valid';
                else
                    this.classes.venue = 'invalid';
                break;
            case 'mc':
                if (this.event.MaxContestants)
                    this.classes.mc = 'valid';
                else
                    this.classes.mc = 'invalid';
                break;
            case 'cr':
                if (this.event.CurrentRound)
                    this.classes.cr = 'valid';
                else
                    this.classes.cr = 'invalid';
            case 'start':
                var d = new Date(this.event.Start);
                if (isNaN(d.getDate()))
                    this.classes.start = 'invalid';
                else
                    this.classes.start = 'valid';
                break;
            case 'end':
                var d = new Date(this.event.End);
                if (isNaN(d.getDate()))
                    this.classes.end = 'invalid';
                else
                    this.classes.end = 'valid';
                break;
        }
    };
    WelcomeComponent.prototype.showErrorToast = function (msg) {
        this.toastyService.error({
            title: "Error",
            msg: msg,
            showClose: true,
            timeout: 3000,
        });
    };
    WelcomeComponent.prototype.showSuccessToast = function (msg) {
        this.toastyService.success({
            title: 'Success',
            msg: msg,
            showClose: true,
            timeout: 3000
        });
    };
    WelcomeComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/welcome/welcome.component.html',
            providers: [upload_service_1.UploadService]
        }), 
        __metadata('design:paramtypes', [participants_service_1.ParticipantsService, event_service_1.EventService, session_service_1.SessionService, upload_service_1.UploadService, ng2_toasty_1.ToastyService, ng2_toasty_1.ToastyConfig])
    ], WelcomeComponent);
    return WelcomeComponent;
}());
exports.WelcomeComponent = WelcomeComponent;
//# sourceMappingURL=welcome.component.js.map