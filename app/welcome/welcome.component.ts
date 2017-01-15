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
          console.log(id);
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
                        event.data.Start = this.toDateString(new Date(event.data.Start));
                    }
                    if(event.data.End) {
                        event.data.End = this.toDateString(new Date(event.data.End));
                    }
                    this.event = event.data;
                }
                else {
                    this.alertService.error(event.data);
                }
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
                                    Id: participant.Student.Id,
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
        let errMsg = '';
        if(isNaN(s.getDate()))
            errMsg = 'Start date is undefined';
        else if(isNaN(e.getDate()))
            errMsg = 'End date is undefined';
        else if(this.event.Description.length < 1)
            errMsg = 'Please write some description';
        else if(this.event.Rules.length < 1)
            errMsg = 'Please write rules for the event';
        else if(this.event.Venue.length == 0)
            errMsg = 'Please specify venue for the event';
        else if(!this.event.MaxContestants)
            errMsg = 'Plese specify maxiumum number of contestants per team';
        else if(this.event.CurrentRound == undefined)
            errMsg = 'Please specify current round of the event';
        else if(this.event.TotalRounds == undefined)
            errMsg = 'Please specify total number of rounds';
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
        if(errMsg.length) {
            this.alertService.error(errMsg);
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
                        this.alertService.error(response.data);
                    }
                },
                err => {
                    this.alertService.clear();
                    this.alertService.error("Something went wrong, contact gawds");
                    console.log('Error occured', err);
                }
            )
    }

    backwardParticipant(index: number, id: number) {
        // Move participants to next level
        this.alertService.wait("Taking back", "Processing...");
        this.participantsService.backwardParticipant(this.eventId, id)
            .subscribe(
                response => {
                    this.alertService.clear();
                    if(response.status.code === 200) {
                        this.alertService.success("Successfully processed");
                        this.participants[index].Level--;
                        this.sortParticipants();
                    }
                    else {
                        this.alertService.clear();
                        this.alertService.error(response.data);
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
                    this.alertService.error(response.data);
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
                    this.alertService.error(response.data);
                }
            },
            err => {
                this.alertService.clear();
                this.alertService.error("Contact gawds to resolve the error");
                console.log(err);
            }
        )
    }

    private toDateString(date: Date): string {
        return (date.getFullYear().toString() + '-'
            + ("0" + (date.getMonth() + 1)).slice(-2) + '-'
            + ("0" + (date.getDate())).slice(-2))
            + 'T' + date.toTimeString().slice(0,5);
    }
    convertDate(d) {
        d = new Date(d);
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000*'+0.0'));
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
                      this.alertService.error(response.data);
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
