/**
 * Created by varun on 12/10/16.
 */
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent }   from './login/login.component';
import { EventComponent }   from './event/event.component';
import { ParticipantsComponent }   from './participants/participants.component';
import { NotificationComponent }   from './notification/notification.component';
import { WelcomeComponent }   from './welcome/welcome.component';
import { AuthGuard }    from './shared/auth-guard.service';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'login', component: LoginComponent },
            { path: 'edit-event', component: EventComponent, canActivate: [AuthGuard] },
            { path: 'participants', component: ParticipantsComponent, canActivate: [AuthGuard] },
            { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },
            { path: '', component: WelcomeComponent, canActivate: [AuthGuard] },
            { path: '**', component: WelcomeComponent, canActivate: [AuthGuard] }
        ], { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
