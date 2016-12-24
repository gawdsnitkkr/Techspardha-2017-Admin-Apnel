import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import  Constants = require('../shared/constants');

import 'rxjs/add/operator/map'


@Injectable()
export class NotificationService {
    constructor(private http: Http) {

    }

    notify(eventId, type, message, token, ids = null) {
        switch(type) {
            case 'all':
                return this.http.post(Constants.apis.notifyAll(eventId), {
                    message,
                    token
                }).map(res => res.json());

            case 'current':
                return this.http.post(Constants.apis.notify(eventId), {
                    token,
                    message: message,
                    data: ids
                }).map(res => res.json());
        }

    }
}
