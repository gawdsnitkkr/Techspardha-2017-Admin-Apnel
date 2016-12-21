import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  Constants = require('../shared/constants');
import { SessionService } from '../shared/session.service';

import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    constructor(
        private http: Http,
        private sessionService: SessionService,
        private router: Router) {

    }

    login(username: string, password: string) {
        return this.http.post(Constants.apis.login,{ username, password }, {
            headers: this.getHeaders()
        }).map(res => res.json());
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return headers;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
