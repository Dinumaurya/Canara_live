import { AfterViewInit, ChangeDetectorRef, Component, Injectable, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgbModalConfig, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { environment } from "../../../environments/environment";
import { FormHelperService } from '../_helpers';
import { AppCommonService } from '@common/services';
import { ToastService } from '../common';
import Swal from 'sweetalert2'

/**
 * Modal Component
 */
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-modal-content',
    providers: [NgbModalConfig, NgbModal],
    template: `
    <ng-template #content let-modal>
        <div class="modal-header">
            <h4 class="modal-title">{{title}}</h4>
            <button type="button" class="close" aria-label="Close" (click)="modal.dismiss('Cross click')">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{body}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-light" (click)="modal.close('Close click')">Close</button>
        </div>
    </ng-template>`
})
export class ModalContentComponent implements OnInit {

    @ViewChild("content", { static: false }) content: any;
    title: string;
    body: string;
    isError = false;
    constructor(
        private modalService: NgbModal
    ) {
        this.title = "";
        this.body = "";
    }

    ngOnInit() {

    }
    openModal(title: string, body: string, isError: boolean) {
        this.title = title;
        this.body = body;
        this.isError = isError;
        this.modalService.open(this.content, { size: 'sm' });
    }
}
@Injectable()
export abstract class BaseAdminComponent implements OnInit, AfterViewInit {
    public ref: ChangeDetectorRef;
    public toastService: ToastService;
    public formHelper: FormHelperService;
    public formBuilder: FormBuilder;
    public comservice: AppCommonService;
    public spinner: NgxSpinnerService;
    public modalConfig: NgbModalConfig;
    public modalService: NgbModal;
    public router: Router;
    public activatedRoute: ActivatedRoute;
    public calendar: NgbCalendar;
    public moment = moment;
    public environment = environment;
    public country = [];
    public currency = [];
    constructor(private injector: Injector) {
        this.ref = this.injector.get(ChangeDetectorRef);
        this.toastService = this.injector.get(ToastService);
        this.formHelper = this.injector.get(FormHelperService);
        this.formBuilder = this.injector.get(FormBuilder);
        this.comservice = this.injector.get(AppCommonService);
        this.spinner = this.injector.get(NgxSpinnerService);
        this.modalConfig = this.injector.get(NgbModalConfig);
        this.modalService = this.injector.get(NgbModal);
        this.router = this.injector.get(Router);
        this.activatedRoute = this.injector.get(ActivatedRoute);
        this.calendar = this.injector.get(NgbCalendar);
        this.modalConfig.backdrop = 'static';
        this.modalConfig.keyboard = false;
        this.getCountry();
        this.getCurrency();
    }
    ngOnInit(): void {

    }
    ngAfterViewInit(): void {

    }
    getCountry() {
        this.comservice.getCountry()
            .subscribe(data => {
                this.country = data;
            })
    }
    getCurrency() {
        this.comservice.getCurrency()
            .subscribe(data => {
                this.currency = data.sort((a: any, b: any) => a.code.localeCompare(b.code))
            })
    }

    get isRetailUser() {
        let sessionItem: any = sessionStorage.getItem('user');
        if (sessionItem != null) {
            sessionItem = JSON.parse(sessionItem);
        }
        if (sessionItem.ibUsrType == "I") {
            return true;
        }
        return false
    }
    showSwalError(message: string) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,

        })
    }
}
