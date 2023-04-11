import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ChildActivationEnd, Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    // some fields to store our state so we can display it in the UI
    idleState = 'NOT_STARTED';
    countdown?: number | null | undefined = null;
    lastPing?: Date | null | undefined = null;
    title = 'Canara DMS';
    constructor(
        public router: Router,
        private titleService: Title,
        private idle: Idle,
        keepalive: Keepalive,
        cd: ChangeDetectorRef
    ) {
        this.router.events
            .pipe(filter(event => event instanceof ChildActivationEnd))
            .subscribe(event => {
                let snapshot = (event as ChildActivationEnd).snapshot;
                while (snapshot.firstChild !== null) {
                    snapshot = snapshot.firstChild;
                }
                this.titleService.setTitle(snapshot.data.title || 'SB Admin Angular');
            });
        // set idle parameters
        idle.setIdle(2700); // 2700 how long can they be inactive before considered idle, in seconds
        idle.setTimeout(30); // how long can they be idle before considered timed out, in seconds
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

        // do something when the user becomes idle
        idle.onIdleStart.subscribe(() => {
            this.idleState = 'IDLE';
        });
        // do something when the user is no longer idle
        idle.onIdleEnd.subscribe(() => {
            this.idleState = 'NOT_IDLE';
            console.log(`${this.idleState} ${new Date()}`);
            this.countdown = null;
            cd.detectChanges(); // how do i avoid this kludge?
        });
        // do something when the user has timed out
        idle.onTimeout.subscribe(() => {
            if (this.isLoggedIn()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Timeout',
                    text: 'You have been ideal for 45 minutes',
                });
                sessionStorage.clear();
            }
            this.router.navigate(['error/408']);
            return (this.idleState = 'TIMED_OUT');
        });
        // do something as the timeout countdown does its thing
        idle.onTimeoutWarning.subscribe((seconds: any) => (this.countdown = seconds));
        // set keepalive parameters, omit if not using keepalive
        keepalive.interval(15); // will ping at this interval while not idle, in seconds
        keepalive.onPing.subscribe(() => (this.lastPing = new Date())); // do something when it pings
    }
    reset() {
        // we'll call this method when we want to start/reset the idle process
        // reset any component state and be sure to call idle.watch()
        this.idle.watch();
        this.idleState = 'NOT_IDLE';
        this.countdown = null;
        this.lastPing = null;
    }

    ngOnInit(): void {
        // right when the component initializes, start reset state and start watching
        this.reset();
    }
    public isLoggedIn(): boolean {
        const sessionItem = sessionStorage.getItem('token');
        if (sessionItem == null) {
            return false;
        } else {
            return true;
        }
    }
}
