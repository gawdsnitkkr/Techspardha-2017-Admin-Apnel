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
    ) {}
    ngOnInit(): void {
        this.admin = this.sessionService.getAdmin();
        this.redirectToDashboard(this.admin);
    }
    redirectToDashboard(admin: Admin): void {
        if (admin && admin.name) {
            this.router.navigate(['/welcome']);
        }
    }

}
