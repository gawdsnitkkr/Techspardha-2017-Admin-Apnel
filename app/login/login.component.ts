import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, Request, RequestMethod, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import { SessionService } from '../shared/session.service';
import { Admin } from '../shared/admin.interface';

@Component({
    templateUrl: 'app/login/login.component.html',
    providers: [ AuthenticationService ]
})
export class LoginComponent {
    constructor(private http: Http,
        private authenticationService: AuthenticationService,
        private sessionService: SessionService,
        private router: Router,
        private alertService: AlertService) {
    }
    ngOnInit(): void {
        if(this.sessionService.getAdmin()) {
            this.router.navigate(['/welcome']);
        }
    }
    adminLogin(username: string, password: string): void {
        this.alertService.wait('Please wait', 'Signing in...');
        this.authenticationService.login(username, password).subscribe((data) => {
            this.alertService.clear();
            if(data.status.code === 200) {
                let admin: Admin = {
                    email: data.data.Email,
                    name: data.data.Name,
                    id: data.data.Id,
                    token: data.data.token
                };
                this.sessionService.setAdmin(admin);
                // Show success alert
                this.router.navigate(['/welcome']);
            }
            else {
                // Invalid credentials
                this.alertService.error('Error', data.status.message);
            }

        },
        err => {
            this.alertService.clear();
            console.log("Error occured", err);
            this.alertService.timeout();
        }
        );
    }
}
