import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Admin } from './admin.interface';
import constants = require('./constants');
import { LocalStorage } from './localStorage';

@Injectable()
export class SessionService {
    private localStorage;
    private static admin: Admin;
    constructor(private http: Http) {
        this.localStorage = new LocalStorage();
    }

    getAdmin(): Admin {
        let user: Admin = this.localStorage.getItem('user');
        if(user) {
            SessionService.admin = user;
        }

        return SessionService.admin;
    }

    logout() {
        this.localStorage.removeItem('user');
        SessionService.admin = undefined;
        return true;
    }

    setAdmin(admin: Admin) : boolean {
        this.localStorage.setItem('user', admin);
        SessionService.admin = admin;
        return true;
    }
}
