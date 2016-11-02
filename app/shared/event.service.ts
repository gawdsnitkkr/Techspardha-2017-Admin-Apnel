/**
 * Created by varun on 1/11/16.
 */
import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Event } from './event.interface';
import constants = require('./constants');

@Injectable()
export class EventService {
    private static event: Event;
    private getEventUrl: string = constants.apis.getEvent;
    constructor(private http: Http) {
    }
    getEvent(): Event {
        return EventService.event;
    }
    setEvent(event: Event) : void {
        EventService.event = event;
    }
    retrieveEvent(): Observable<Event> {
        return this.http.post(this.getEventUrl, {}, {})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}
