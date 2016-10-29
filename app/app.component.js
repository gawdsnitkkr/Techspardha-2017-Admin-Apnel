"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by varun on 19/9/16.
 */
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var session_service_1 = require('./shared/session.service');
var constants = require('./shared/constants');
var AppComponent = (function () {
    function AppComponent(sessionService, router) {
        this.sessionService = sessionService;
        this.router = router;
        //narendra........................................
        this.count = 0;
        this.count1 = 0;
        this.toolbarColor = '#676767';
        this.toolbarBackground = 'rgb(255, 255, 255)';
        this.contentColor = '#676767';
        this.contentBackground = 'rgb(238, 238, 238)';
        this.toggleClassSidebar = 'show-sidebar';
        this.toggleClassContent = 'sidebar-displayed';
    }
    AppComponent.prototype.showEvents = function () {
        this.count++;
        if (this.count % 2 != 0)
            document.getElementById('eventList').style.display = "block";
        else
            document.getElementById('eventList').style.display = "none";
    };
    AppComponent.prototype.showParticipations = function () {
        this.count1++;
        if (this.count1 % 2 != 0)
            document.getElementById('participants').style.display = "block";
        else
            document.getElementById('participants').style.display = "none";
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (window.innerWidth <= 768) {
            this.toggleSidebar();
        }
        console.log(constants.colorScheme);
        this.admin = this.sessionService.getAdmin();
        if (this.admin == null) {
            this.sessionService.retrieveAdmin()
                .subscribe(function (admin) {
                _this.admin = admin;
                _this.sessionService.setAdmin(admin);
                console.log(_this.sessionService.getAdmin());
            });
        }
        /*this.router.events.subscribe((event) => {
            console.log('route changed', event);
            return false;
        });*/
    };
    AppComponent.prototype.changeLayout = function (toolbarColor, toolbarBackground, contentColor, contentBackground) {
        this.toolbarColor = toolbarColor;
        this.toolbarBackground = toolbarBackground;
        this.contentColor = contentColor;
        this.contentBackground = contentBackground;
    };
    AppComponent.prototype.toggleSidebar = function () {
        if (this.toggleClassSidebar == 'show-sidebar') {
            this.toggleClassSidebar = 'hide-sidebar';
            this.toggleClassContent = 'sidebar-hidden';
        }
        else {
            this.toggleClassSidebar = 'show-sidebar';
            this.toggleClassContent = 'sidebar-displayed';
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app.component.html',
            providers: []
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map