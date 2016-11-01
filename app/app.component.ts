/**
 * Created by varun on 19/9/16.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SessionService } from './shared/session.service';

import { Admin } from './shared/admin.interface';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    providers: []
})
export class AppComponent {
    private admin: Admin;
    constructor(
        private sessionService: SessionService,
        private router: Router
    ) {
    }
    ngOnInit(): void {
        this.admin = this.sessionService.getAdmin();
        this.redirectToDashboard(this.admin);
        if (this.admin == null) {
            this.sessionService.retrieveAdmin()
                .subscribe(
                    admin => {
                        this.admin = admin;
                        this.sessionService.setAdmin(admin);
                        //console.log(this.sessionService.getAdmin());
                        this.redirectToDashboard(admin);
                    },
                    err => {
                        console.log('error occured');
                    }
                );
        }
    }
    redirectToDashboard(admin: Admin): void {
        if (admin && admin.name && admin.status) {
            this.router.navigate(['/welcome']);
        }
    }
    
}

