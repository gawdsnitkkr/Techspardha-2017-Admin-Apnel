/**
 * Created by varun on 12/10/16.
 */
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent }   from './login/login.component';
import { WelcomeComponent }   from './welcome/welcome.component';
import { AuthGuard }    from './shared/auth-guard.service';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'login', component: LoginComponent },
            { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
            /*{ path: 'edit-event', component: EventComponent, canActivate: [AuthGuard] },
            { path: 'participants', component: ParticipantsComponent, canActivate: [AuthGuard] },
            { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },*/
            { path: '', component: LoginComponent },
            { path: '**', component: LoginComponent }
        ], { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
