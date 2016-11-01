/**
 * Created by varun on 19/9/16.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SessionService } from './shared/session.service';

import { Admin } from './shared/admin.interface';
import constants = require('./shared/constants');

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    providers: []
})
export class AppComponent {
    private admin: Admin;
    toolbarColor: string = '#676767';
    toolbarBackground: string = 'rgb(255, 255, 255)';
    contentColor: string = '#676767';
    contentBackground: string = 'rgb(238, 238, 238)';
    toggleClassSidebar: string = 'show-sidebar';
    toggleClassContent: string = 'sidebar-displayed';
    constructor(
        private sessionService: SessionService,
        private router: Router
    ) {
    }
    ngOnInit(): void {
        if (window.innerWidth <= 768) {
            this.toggleSidebar();
        }
        //console.log(constants.colorScheme);
        this.admin = this.sessionService.getAdmin();
        if (this.admin == null) {
            this.sessionService.retrieveAdmin()
                .subscribe(
                    admin => {
                        this.admin = admin;
                        this.sessionService.setAdmin(admin);
                        //console.log(this.sessionService.getAdmin());
                    },
                    err => {
                        console.log('error occured');
                    }
                );
        }
    }
    changeLayout(toolbarColor: string, toolbarBackground: string, contentColor: string, contentBackground: string): void {
        this.toolbarColor = toolbarColor;
        this.toolbarBackground = toolbarBackground;
        this.contentColor = contentColor;
        this.contentBackground = contentBackground;
    }
    toggleSidebar(): void {
        if (this.toggleClassSidebar == 'show-sidebar') {
            this.toggleClassSidebar = 'hide-sidebar';
            this.toggleClassContent = 'sidebar-hidden';
        } else {
            this.toggleClassSidebar = 'show-sidebar';
            this.toggleClassContent = 'sidebar-displayed';
        }
    }
}

