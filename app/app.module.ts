/**
 * Created by varun on 19/9/16.
 */
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }   from './app.component';
import { EventComponent }   from './event/event.component';
import { NotificationComponent }   from './notification/notification.component';
import { ParticipantsComponent }   from './participants/participants.component';
import { WelcomeComponent }   from './welcome/welcome.component';

import { AppRoutingModule } from './app-routing.module';
import { SessionService } from './shared/session.service';
import { AuthGuard } from './shared/auth-guard.service';

import { LoginComponent }   from './login/login.component';
@NgModule({
    imports:      [
        BrowserModule,
        AppRoutingModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        EventComponent,
        WelcomeComponent,
        NotificationComponent,
        ParticipantsComponent
    ],
    providers: [
        SessionService, AuthGuard
    ],
    bootstrap:    [
        AppComponent
    ]
})
export class AppModule { }


