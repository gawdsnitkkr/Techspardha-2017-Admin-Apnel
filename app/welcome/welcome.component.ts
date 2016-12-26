import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalModule } from "ng2-modal";

import { ParticipantsService } from '../shared/participants.service';
import { EventService } from '../shared/event.service';
import { SessionService } from '../shared/session.service';
import { UploadService } from '../services/upload.service';
import { AlertService } from '../services/alert.service';
import { NotificationService } from '../services/notification.service';
import { AuthenticationService } from '../services/authentication.service';
import constants = require('../shared/constants');
import { Participant } from '../shared/participant.interface';
import { Event } from '../shared/event.interface';
import { Admin } from "../shared/admin.interface";


@Component({
    templateUrl:  'app/welcome/welcome.component.html',
    providers: [ UploadService, AuthenticationService ]
})
export class WelcomeComponent {
    private eventId: number;            // Coordinator's event ID
    private participantIDs: number[];   // All participants IDs registered for the event
    private event: Event;               // Event details object
    private classes: Object;            // Classes for validation
    private participants: Participant[];// Participants of the event
    private responseActiveClass: string;
    private eventActiveClass: string;
    private showTabContent: string;
    private notiMessage: string;        // Notification message
    private admin: Admin;               // Coordinator details
    private curInviteId: number;
    @ViewChild('oneModal') oneModal;


    constructor(
            private participantsService: ParticipantsService,
            private eventService: EventService,
            private alertService: AlertService,
            private sessionService: SessionService,
            private uploadService: UploadService,
            private notificationService: NotificationService,
            private authenticationService: AuthenticationService) {
        this.eventActiveClass = 'event-active';
        this.responseActiveClass = '';
        this.showTabContent = 'event';
        this.classes = {
            'desc': 'valid',
            'rules': 'valid',
            'start': 'valid',
            'end': 'valid',
            'venue': 'valid',
            'mc': 'valid',
            'tr': 'valid',
            'file': 'valid',
            'st': 'valid',
        };
        this.uploadService.progress$.subscribe(progress => {

        },
        err => {
            this.alertService.clear();
            this.alertService.error('upload error', "Error uploading the file");
        });
    }
    ngOnInit(): void {
        this.event = this.eventService.getEvent();
        this.oneModal.onOpen.subscribe((id) => {
          this.curInviteId = id[0];
        });
        if (!this.event) {
            this.alertService.wait("Please wait while we fetch event details",
                "Loading events");
            this.eventService.retrieveEventId()
                .subscribe(
                    event => {
                        this.alertService.clear();
                        this.eventId = event.data[0];
                        this.fetchAndUpdateEvent();
                        this.fetchAndUpdateParticipants();
                    },
                    err => {
                        this.alertService.clear();
                        console.log('error occured');
                    }
                );
        }
        this.admin = this.sessionService.getAdmin();
    }

    fetchAndUpdateEvent(): void {
        // Fetches event details
        this.eventService.retrieveEvent(this.eventId)
            .subscribe((event) => {
                if(event.status.code === 200) {
                    if(event.data.Start) {
                        event.data.Start = new Date(event.data.Start).toLocaleString();
                    }
                    if(event.data.End) {
                        event.data.End = new Date(event.data.End).toLocaleString();
                    }
                    this.event = event.data;
                }
                else {
                    this.alertService.error(event.status.message);
                }
                this.validateAll();
            },
            err => {
                this.alertService.clear();
                this.alertService.error("Error occured, contact gawds");
            }
            )
    }

    fetchAndUpdateParticipants(): void {
        // Fetches participants of the event
        this.participants = undefined;
        this.alertService.wait("Please wait while participants are being fetched", "Fetching Participants");
        this.participantsService.retrieveParticipants(this.eventId)
            .subscribe(
                response => {
                    if(response.status.code === 200) {
                        this.alertService.clear();
                        this.alertService.success("Participants updated");
                        this.participants = response.data.map((participant) => {
                            if(participant.Student) {
                                return {
                                    Name: participant.Student.Name,
                                    Level: participant.CurrentRound,
                                    Email: participant.Student.Email,
                                    College: participant.Student.Details.College,
                                    Mobile: participant.Student.Details.PhoneNumber
                                }
                            }
                            else if(participant.Team) {
                                return {
                                    Name: participant.Team.Name,
                                    Id: participant.Team.Id,
                                    Level: participant.CurrentRound,
                                    College: participant.Team.TeamLeader.Details.College,
                                    Mobile: participant.Team.TeamLeader.Details.PhoneNumber
                                }
                            }
                        });
                        this.sortParticipants();
                        this.participantsService.setParticipants(this.participants);
                    }
                },
                err => {
                    this.alertService.clear();
                    this.alertService.error("Error occured, contact gawds");
                    console.log('Error while fetch and update participants', err);
                }
            );
    }

    getEvent(): Event {
        return this.event;
    }

    getParticipants(): Participant[] {
        return this.participants;
    }

    onResponseButtonClick(): void {
        this.responseActiveClass = 'response-active';
        this.eventActiveClass = '';
        this.showTabContent = 'response';
    }

    onEventButtonClick(): void {
        this.responseActiveClass = '';
        this.eventActiveClass = 'event-active';
        this.showTabContent = 'event';
    }

    updateStatus(): void {
    }

    updateEvent(): void {
        // When update event button is clicked, validate form and
        // upload the changes
        let payload: Event = JSON.parse(JSON.stringify(this.event));;

        let s = new Date(this.event.Start);
        let e = new Date(this.event.End);
        if(
            isNaN(s.getDate()) ||
            isNaN(e.getDate()) ||
            this.event.Description.length < 10 ||
            this.event.Rules.length < 10 ||
            this.event.Venue.length == 0 ||
            !this.event.MaxContestants ||
            this.event.CurrentRound == undefined ||
            this.event.Pdf.length == 0
            ) {
            this.alertService.error("Please correct the red boxes");
        }
        else {
            // No errors, post request
            payload.Start = this.convertDate(payload.Start);
            payload.End = this.convertDate(payload.End);

            this.alertService.wait("Pushing the changes", "Uploading");
            this.eventService.updateEvent(this.eventId, payload, this.admin.token).subscribe(
                response => {
                    if(response.status.code === 200) {
                        this.alertService.clear();
                            this.alertService.success("Successfully updated");
                    }
                },
                err => {
                    this.alertService.error("Something went wrong, contact gawds");
                    console.log("error occured", err);
                }
            );
        }


    }
    forwardParticipant(index: number, id: number) {
        // Move participants to next level
        this.alertService.wait("To the next level", "Forwarding...");
        this.participantsService.forwardParticipant(this.eventId, id)
            .subscribe(
                response => {
                    this.alertService.clear();
                    if(response.status.code === 200) {
                        this.alertService.success("Successfully forwarded");
                        this.participants[index].Level++;
                        this.sortParticipants();
                    }
                    else {
                        this.alertService.clear();
                        this.alertService.error(response.status.message);
                    }
                },
                err => {
                    this.alertService.clear();
                    this.alertService.error("Something went wrong, contact gawds");
                    console.log('Error occured', err);
                }
            )
    }
    sortParticipants() {
        // Arrange participants according to current round
        // Participants in current round on top
        this.participants = this.participants.sort((first, second) => {
            return first.Level - second.Level;
        });
    }

    logout() {
        this.sessionService.logout();
    }

    fileChanged(event) {
        // Uploads the file to server
        this.alertService.wait("Please wait while pdf is being uploaded", "Uploading");
        var files = event.srcElement.files;
        this.uploadService.makeFileRequest(constants.apis.pdfs,
            this.admin.token, files).subscribe((response) => {
                this.alertService.clear();
                if(response.status.code == 200) {
                    this.event.Pdf = "http://techspardha.org/api/static/" + response.data.filename;
                    this.alertService.success(
                        "File uploaded successfully, hit update to save the details"
                    );
                }
                else {
                    this.alertService.error(
                        response.data, "Upload failed");
                }
            }, (err) => {
                console.log(err);
                this.alertService.error(err, "Contact gawds");
            });
    }

    notifyAll() {
        this.alertService.wait("Please wait while we are notifying participants",
            "Notifying all participants");
        let msg = this.notiMessage;
        this.notificationService.notify(this.event.Id, 'all', msg, this.admin.token).subscribe(
            response => {
                this.alertService.clear();
                if(response.status.code === 200) {
                    this.alertService.success('Notified');
                    this.notiMessage = '';
                }
                else {
                    this.alertService.error(response.status.message);
                }
            },
            err => {
                this.alertService.clear();
                this.alertService.error("Contact gawds to resolve the error");
                console.log(err);
            }
        )
    }

    notifyOne() {
        this.alertService.wait("Please wait while we are notifying participants",
            "Notifying all participants");
        let msg = this.notiMessage;
        this.notificationService.notify(this.event.Id, 'current', msg, this.admin.token, [this.curInviteId]).subscribe(
            response => {
                this.alertService.clear();
                if(response.status.code === 200) {
                    this.alertService.success('Notified');
                    this.notiMessage = '';
                }
                else {
                    this.alertService.error(response.status.message);
                }
            },
            err => {
                this.alertService.clear();
                this.alertService.error("Contact gawds to resolve the error");
                console.log(err);
            }
        )
    }

    validateAll() {
        let choices = ['desc', 'rules', 'venue', 'mc', 'cr', 'tr', 'start', 'end' ,'file', 'st'];
        for ( let choice of choices ) {
            this.validate(choice);
        }
    }

    convertDate(d) {
        d = new Date(d);
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000*'+5.5'));
    }

    validate(obj) {
        switch(obj) {
            case 'desc':
                if(this.event.Description.length >= 10)
                    this.classes.desc = 'valid';
                else
                    this.classes.desc = 'invalid';
                break;
            case 'rules':
                if(this.event.Rules.length >= 10)
                    this.classes.rules = 'valid';
                else
                    this.classes.rules = 'invalid';
                break;
            case 'venue':
                if(this.event.Venue.length)
                    this.classes.venue = 'valid';
                else
                    this.classes.venue = 'invalid';
                break;
            case 'mc':
                if(this.event.MaxContestants != undefined &&
                    this.event.MaxContestants >= 0)
                    this.classes.mc = 'valid';
                else
                    this.classes.mc = 'invalid';
                break;
            case 'cr':
                if(this.event.CurrentRound != undefined &&
                    this.event.CurrentRound >= 0)
                    this.classes.cr = 'valid';
                else
                    this.classes.cr = 'invalid';
                break;
            case 'tr':
                if(this.event.TotalRounds != undefined &&
                    this.event.TotalRounds > 0)
                    this.classes.tr = 'valid';
                else
                    this.classes.tr = 'invalid';
            case 'start':
                var d = new Date(this.event.Start);
                if(isNaN(d.getDate()))
                    this.classes.start = 'invalid';
                else
                    this.classes.start = 'valid';
                break;
            case 'end':
                var d = new Date(this.event.End);
                if(isNaN(d.getDate()))
                    this.classes.end = 'invalid';
                else
                    this.classes.end = 'valid';
                break;
            case 'file':
                if(this.event.Pdf.length == 0) {
                    this.classes.file = 'invalid';
                }
                else {
                    this.classes.file = 'valid';
                }
                break;
            case 'st':
                if(this.event.Status != undefined && this.event.Status.length > 0) {
                    this.classes.st = 'valid';
                }
                else {
                    this.classes.st = 'invalid';
                }
                break;
        }
    }

    changePassword() {
      console.log(this.chPass);
      this.alertService.wait('Please wait...', 'Changing password');
      if(this.chPass) {
          this.authenticationService.changePassword(this.admin.token, this.chPass).subscribe(
              response => {
                  this.alertService.clear();
                  if(response.status.code == 200) {
                      this.alertService.success('Password changed successfully');
                  }
                  else {
                      this.alertService.error(response.status.message);
                  }
              },
              err => {
                  console.log(err);
                  this.alertService.error("Please check your internet connection");
              }
          )
      }
    }
}
