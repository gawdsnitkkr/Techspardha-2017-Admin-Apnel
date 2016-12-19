import { Injectable} from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { SessionService } from './session.service';
import { Participant } from './participant.interface';
import constants = require('./constants');
import Admin = require('./admin.interface');

@Injectable()
export class ParticipantsService {
    private static participants: Participant[];
    constructor(
        private http: Http,
        private sessionService: SessionService) {
    }
    getParticipants(): Participant[] {
        return ParticipantsService.participants;
    }
    setParticipants(participants: Participant[]) : void {
        ParticipantsService.participants = participants;
    }
    retrieveParticipants(id: number) {
        let admin: Admin = this.sessionService.getAdmin();

        let params:URLSearchParams = new URLSearchParams();
        params.set('token', admin.token);

        return this.http.get(constants.apis.getParticipants(id), {search: params})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    forwardParticipant(eventId: number, id: number) {
        let admin: Admin = this.sessionService.getAdmin();

        return this.http.post(constants.apis.forwardParticipant(eventId), {
            token: admin.token,
            data: [id]
        }).map(response => response.json())
        .catch(error => Observable.throw(error.json().error || 'Server error'));


    }
}
