/**
 * Created by varun on 1/11/16.
 */
import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Admin } from './admin.interface';
import constants = require('./constants');

@Injectable()
export class SessionService {
    private static admin: Admin;
    private getAdminUrl: string = constants.apis.getAdmin;
    constructor(private http: Http) {
    }
    getAdmin(): Admin {
        //console.log('get admin called');
        return SessionService.admin;
    }
    setAdmin(admin: Admin) : void {
        //console.log('set admin called');
        SessionService.admin = admin;
    }
    retrieveAdmin(): Observable<Admin> {
        //console.log('retrieve admin called');
        return this.http.post(this.getAdminUrl, {}, {})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}
