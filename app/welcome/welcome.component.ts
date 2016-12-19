import { Component, OnInit } from '@angular/core';

import { ParticipantsService } from '../shared/participants.service';
import { EventService } from '../shared/event.service';
import { SessionService } from '../shared/session.service';
import { UploadService } from '../services/upload.service';
import constants = require('../shared/constants');
import { Participant } from '../shared/participant.interface';
import { Event } from '../shared/event.interface';
import { Admin } from "../shared/admin.interface";
import { validateDate } from '../shared/date.validator';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';


@Component({
    templateUrl:  'app/welcome/welcome.component.html',
    providers: [ UploadService ]
})
export class WelcomeComponent {
    private eventId: number;
    private participantIDs: number[];
    private event: Event;
    private classes: Object;
    private currentToastId;
    private participants: Participant[];
    private responseActiveClass: string;
    private eventActiveClass: string;
    private showTabContent: string;
    private admin: Admin;

    constructor(
            private participantsService: ParticipantsService,
            private eventService: EventService,
            private sessionService: SessionService,
            private uploadService: UploadService,
            private toastyService:ToastyService,
            private toastyConfig: ToastyConfig) {
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
        this.uploadService.progress$.subscribe(progress => {
            if(progress === 100) {
                this.toastyService.clear(this.currentToastId);
                this.toastyService.success({
                    title: "Done",
                    msg: "File uploaded successfully, hit update to save the details",
                    timeout: 5000,
                });

            }
        });
    }
    ngOnInit(): void {

        this.event = this.eventService.getEvent();
        if (!this.event) {
            this.eventService.retrieveEventId()
                .subscribe(
                    event => {
                        this.eventId = event.data[0];
                        this.fetchAndUpdateEvent();
                        this.fetchAndUpdateParticipants();
                    },

                    err => {
                        console.log('error occured');
                    }
                );
        }
        this.admin = this.sessionService.getAdmin();

    }

    fetchAndUpdateEvent(): void {

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
                    // TODO: Show failure alert;
                }
            })
    }

    fetchAndUpdateParticipants(): void {
        this.participantsService.retrieveParticipants(this.eventId)
            .subscribe(
                response => {
                    if(response.status.code === 200) {
                        this.participants = response.data.map((participant) => {
                            if(participant.Student) {
                                return {
                                    Id: participant.Student.Id,
                                    Name: participant.Student.Name,
                                    Level: participant.CurrentRound,
                                    Email: participant.Student.Email
                                }
                            }
                            else if(participant.Team) {
                                // TODO: return object for team as well
                            }

                        });
                        this.sortParticipants();
                        this.participantsService.setParticipants(this.participants);
                    }
                },
                err => {
                    console.log('Error while fetch and update participants');
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
        var s = new Date(this.event.Start);
        var e = new Date(this.event.End);
        if(
            isNaN(s.getDate()) ||
            isNaN(e.getDate()) ||
            this.event.Description.length < 10 ||
            this.event.Rules.length < 10 ||
            this.event.Venue.length == 0 ||
            !this.event.MaxContestants ||
            !this.event.CurrentRound ||
            this.event.Pdf.length == 0
            ) {
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
                onAdd: function(toast: ToastData) {
                    this.currentToastId = toast.id;
                },
            })
            this.eventService.updateEvent(this.eventId, this.event, this.admin.token).subscribe(
                response => {
                    console.log(response);
                    if(response.status.code === 200) {
                        this.toastyService.clear(this.currentToastId);
                        this.toastyService.success({
                            title: "Success",
                            msg: "Successfully updated",
                            timeout: 3000
                        })
                    }
                },
                err => {
                    this.showErrorToast("Can't connect to internet")
                    console.log("error occured", err);
                }
            );
        }


    }
    forwardParticipant(index: number, id: number) {
        this.toastyService.wait({
            title: "Forwarding...",
            msg: "To the next level",
            showClose: true,
            timeout: 20000,
            onAdd: function(toast: ToastData) {
                this.currentToastId = toast.id;
            }
        })
        this.participantsService.forwardParticipant(this.eventId, id)
            .subscribe(
                response => {
                    this.toastyService.clear(this.currentToastId);
                    if(response.status.code === 200) {
                        this.showSuccessToast("Successfully forwarded");
                        this.participants[index].Level++;
                        this.sortParticipants();
                    }
                    else {

                    }
                },
                err => {
                    this.showErrorToast("Can't connect to internet");
                    console.log('Error occured');
                }
            )
    }
    sortParticipants() {
        this.participants = this.participants.sort((first, second) => {
            return first.Level - second.Level;
        });
    }

    logout() {
        this.sessionService.logout();
    }

    fileChanged(event) {
        this.toastyService.wait({
            title: "Uploading",
            msg: "Please wait while pdf is being uploaded",
            showClose: true,
            timeout: 60000,
            onAdd: function(toast: ToastData) {
                this.currentToastId = toast.id;
            }
        });

        var files = event.srcElement.files;
        console.log(files);
        this.uploadService.makeFileRequest('http://localhost:3000/api/admin/upload',
            this.admin.token, files).subscribe((data) => {
                if(data) {
                    this.event.Pdf = "http://google.com/" + data[0].filename;
                }
            });
    }

    validate(obj) {
        switch(obj) {
            case 'desc':
                if(this.event.Description.length)
                    this.classes.desc = 'valid';
                else
                    this.classes.desc = 'invalid';
                break;
            case 'rules':
                if(this.event.Rules.length)
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
                if(this.event.MaxContestants)
                    this.classes.mc = 'valid';
                else
                    this.classes.mc = 'invalid';
                break;
            case 'cr':
                if(this.event.CurrentRound)
                    this.classes.cr = 'valid';
                else
                    this.classes.cr = 'invalid';
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

        }
    }

    showErrorToast(msg) {
        this.toastyService.error({
            title: "Error",
            msg: msg,
            showClose: true,
            timeout: 3000,
        })
    }

    showSuccessToast(msg) {
        this.toastyService.success({
            title: 'Success',
            msg: msg,
            showClose: true,
            timeout: 3000
        })
    }

}
