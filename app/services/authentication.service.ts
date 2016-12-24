import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import  Constants = require('../shared/constants');

import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    constructor(
        private http: Http,) {

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
