import { Injectable} from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Event } from './event.interface';
import constants = require('./constants');
import { SessionService } from './session.service';

@Injectable()
export class EventService {
    private static event: Event;
    constructor(private http: Http, private sessionService: SessionService) {
    }
    getEvent(): Event {
/*        return {
          Id: 1,
          Description: 'desc',
          Rules: 'rules',
          Start: '',
          End: '',
          Venue: 'venue',
          MaxContestants: 5,
          CurrentRound: 0,
          TotalRounds: 1,
          Status: 'Not started',
          Pdf: 'hi'
        }
*/      return EventService.event;
    }
    setEvent(event: Event) : void {
        EventService.event = event;
    }
    retrieveEventId() {
        let params:URLSearchParams = new URLSearchParams();
        params.set('token', this.sessionService.getAdmin().token);

        return this.http.get(constants.apis.myEvent, {search: params})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    retrieveEvent(id: number) {
        return this.http.get(constants.apis.getEvent(id))
            .map((response: Response) => response.json())
            .catch((err: any) => Observable.throw(err.json().err || 'Server error'));
    }

    updateEvent(eventId: number, event: any, token: string) {
        event.token = token;
        return this.http.post(constants.apis.getEvent(eventId), event)
            .map((response: Response) => response.json())
            .catch((err: any) => Observable.throw(err.json().arr || 'Server error'));
    }
}
