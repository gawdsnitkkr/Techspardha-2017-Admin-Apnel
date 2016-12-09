/**
 * Created by varun on 12/10/16.
 */
import { Component, OnInit } from '@angular/core';

import { ParticipantsService } from '../shared/participants.service';
import { EventService } from '../shared/event.service';
import constants = require('../shared/constants');
import { Participant } from '../shared/participant.interface';
import { Event } from '../shared/event.interface';

@Component({
    templateUrl: 'app/welcome/welcome.component.html'
})
export class WelcomeComponent {
    private event: Event;
    private participants: Participant[];
    private responseActiveClass: string;
    private eventActiveClass: string;
    private showTabContent: string;
    private inputStatus: string = "inputDeactive";
    private i: number = 1;
    constructor(
        private participantsService: ParticipantsService,
        private eventService: EventService
    ) {
        this.responseActiveClass = 'response-active';
        this.eventActiveClass = '';
        this.showTabContent = 'response';
    }
    ngOnInit(): void {
        //getting event, participants list
        this.event = this.eventService.getEvent();
        if (!this.event) {
            this.eventService.retrieveEvent()
                .subscribe(
                    event => {
                        this.event = event;
                        this.eventService.setEvent(event);
                        console.log(event);
                    },

                    err => {
                        console.log('error occured');
                    }
                );
        }
        this.participants = this.participantsService.getParticipants();
        if (!this.participants) {
            this.participantsService.retrieveParticipants()
                .subscribe(
                    participants => {
                        this.participants = participants; //console.log(participants);
                        this.participantsService.setParticipants(participants);
                    },
                    err => {
                        console.log('error occured');
                    }
                );
        }

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
    }

}
