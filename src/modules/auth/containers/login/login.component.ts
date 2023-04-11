import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCommonService } from '@common/services';
import swal from 'sweetalert2';

@Component({
    selector: 'sb-login',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
    login: any;
    formSubmitted = false;
    encdata = '';
    constructor(
        private route: ActivatedRoute,
        public router: Router,
        public service: AppCommonService
    ) {
        this.login = new FormGroup({
            userId: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
         this.encdata = this.route.snapshot.queryParams.encdata;
            this.service.authenticate(this.encdata).subscribe(
             (success: any) => {
                console.log(success);
                console.log(success.processRights);
                console.log(success.processRights.processType);
                if (success.usersId) {
                    const UserId = success.ibData.UserID;
                    alert('Update v1.0.0: Welcome Customer Name = ' + success.userinfo.firstName);
                    sessionStorage.setItem('user', JSON.stringify(success));
                    sessionStorage.setItem('token', success.usersId);
                    sessionStorage.setItem('userId', UserId);
                    const cstid = success.ibData.AuthKey;
                    sessionStorage.setItem('customerId', cstid);
                    this.router.navigate(['dashboard/welcome']);
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    }
    submitLogin() {
        this.router.navigate(['dashboard/welcome']);
    }
}
