import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { ToastyModule } from 'ng2-toasty';
import { ModalModule } from "ng2-modal";

import { AppComponent }   from './app.component';
import { WelcomeComponent }   from './welcome/welcome.component';

import { AppRoutingModule } from './app-routing.module';
import { SessionService } from './shared/session.service';
import { ParticipantsService } from './shared/participants.service';
import { EventService } from './shared/event.service';
import { AlertService } from './services/alert.service';
import { NotificationService } from './services/notification.service';
import { AuthGuard } from './shared/auth-guard.service';

import { LoginComponent }   from './login/login.component';

@NgModule({
    imports:      [
        BrowserModule,
        AppRoutingModule,
        HttpModule,
        FormsModule,
        ToastyModule.forRoot(),
        ModalModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        WelcomeComponent
    ],
    providers: [
        SessionService,
        AuthGuard,
        ParticipantsService,
        EventService,
        AlertService,
        NotificationService
    ],
    bootstrap:    [
        AppComponent
    ]
})
export class AppModule { }
