/**
 * Created by varun on 1/11/16.
 */
import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Participant } from './participant.interface';
import constants = require('./constants');

@Injectable()
export class ParticipantsService {
    private static participants: Participant[];
    private getParticipantsUrl: string = constants.apis.getParticipants;
    constructor(private http: Http) {
    }
    getParticipants(): Participant[] {
        return ParticipantsService.participants;
    }
    setParticipants(participants: Participant[]) : void {
        ParticipantsService.participants = participants;
    }
    retrieveParticipants(): Observable<Participant[]> {
        return this.http.post(this.getParticipantsUrl, {}, {})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}
