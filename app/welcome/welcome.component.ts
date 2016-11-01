/**
 * Created by varun on 12/10/16.
 */
import { Component, OnInit } from '@angular/core';

import constants = require('../shared/constants');

@Component({
    templateUrl: 'app/welcome/welcome.component.html'
})
export class WelcomeComponent {
    toolbarColor: string = '#676767';
    toolbarBackground: string = 'rgb(255, 255, 255)';
    contentColor: string = '#676767';
    contentBackground: string = 'rgb(238, 238, 238)';
    toggleClassSidebar: string = 'show-sidebar';
    toggleClassContent: string = 'sidebar-displayed';
    constructor() {}
    ngOnInit(): void {
        if (window.innerWidth <= 768) {
            this.toggleSidebar();
        }
        //console.log(constants.colorScheme);
        //getting event, participants list
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
    getEvent(): void {
        
    }
    getParticipants(): void {
        
    }
}