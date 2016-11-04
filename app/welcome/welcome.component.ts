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
    slide1:number;
    //slide1 = 0;
    clickOnResponse(): void {
        //this.slide1 = 1;
        //console.log(this.slide1);
    }
    private event: Event;
    private participants: Participant[];
    constructor(
        private participantsService: ParticipantsService,
        private eventService: EventService
    ) {
        this.slide1 = 0;
    }
    ngOnInit(): void {console.log('called ngonin');
        //getting event, participants list
        this.event = this.eventService.getEvent();
        if (!this.event) {
            this.eventService.retrieveEvent()
                .subscribe(
                    event => {
                        this.event = event;
                        this.eventService.setEvent(event);
                        console.log('hey', event);
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
                        this.participants = participants;
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


}