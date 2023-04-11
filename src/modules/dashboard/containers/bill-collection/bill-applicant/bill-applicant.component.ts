import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';

@Component({
    selector: 'sb-bill-applicant',
    templateUrl: './bill-applicant.component.html',
    styleUrls: ['./bill-applicant.component.scss'],
})
export class BillApplicantComponent implements AfterViewInit {
    @Input() currency: any = [];
    @Input() country = [];
    @Output('appEvent') appEvent = new EventEmitter();
    @Output() informParent = new EventEmitter();
    public accountNumberList: any = [];
    public lcTransBnkVo: any = [];
    public amount: string;
    public billApplicantDetail: FormGroup;
    public submittedBillApplicant = false;
    public amntWords: any;
    public trans = false;
    public partial = false;
    public isEBFA:boolean=false;
    public childMessage: any;
    public radioAction: any;
    public radio = false;
    public hideRadio: any;
    public hideValue = false;
    public hideBrd = false;
    public hideBrdSecond = false;
    public hideWhetherCan = false;
    public hideBrdThird = false;
    constructor(
        private ref: ChangeDetectorRef,
        public fh: FormHelperService,
        private formBuilder: FormBuilder,
        private comservice: AppCommonService
    ) {
        this.amount = '';
        const dt = new Date();
        this.billApplicantDetail = this.formBuilder.group(
            {
                sysRefNo: new FormControl('', []),
                transRefNo: new FormControl('', []),
                sysRefDt: new FormControl(dt, [Validators.required]),
                bills: new FormControl('', [Validators.required]),
                lcNum: new FormControl('', []),
                lcDate: new FormControl('', []),
                whrLcIsRcvByCN: new FormControl('', []),
                letterOfCredit: new FormControl('', []),
                brd: new FormControl('', []),
                amount: new FormControl('', [Validators.required]),
                currency: new FormControl('', [Validators.required]),
                amntWords: new FormControl('', [Validators.required]),
                billpurchs: new FormControl('FULL', []),
                exportBillsCustDtlsVo: this.formBuilder.group({
                    custId: new FormControl('', [Validators.required]),
                    cntryId: new FormControl('', [Validators.required]),
                    accNo: new FormControl('', [Validators.required, Validators.maxLength(16)]),
                    custNm: new FormControl('', [
                        Validators.required,
                        Validators.pattern(this.fh.CUSTOMER_NAME_REG),
                    ]),
                    brnchNm: new FormControl('', [Validators.required]),
                    dpCode: new FormControl('', [Validators.required, Validators.maxLength(5)]),
                    telNo: new FormControl('', [Validators.maxLength(13)]),
                    mobNo: new FormControl('', [Validators.required, Validators.maxLength(13)]),
                    eMail: new FormControl('', [
                        Validators.required,
                        Validators.pattern(this.fh.EMAIL_REG),
                    ]),
                    altEmail: new FormControl('', Validators.pattern(this.fh.EMAIL_REG)),
                    address1: new FormControl('', [Validators.required, Validators.maxLength(35)]),
                    address2: new FormControl('', [Validators.maxLength(35)]),
                    address3: new FormControl('', [Validators.maxLength(35)]),
                    ieCode: new FormControl('', [Validators.required]),
                    panNo: new FormControl('', [
                        Validators.required,
                        Validators.pattern(this.fh.PAN_REG),
                    ]),
                }),
            },
            {
                validators: [
                    this.isLetterOfCreditRequired,
                   /*  this.isbillpurchsRequired, */
                    this.isLetterOfCreditRequired2,
                ],
            }
        );
    }

    isLetterOfCreditRequired(group: FormGroup): { [s: string]: boolean } | null {
        console.log('group', group);
        if (group) {
            if (group.controls.bills.value == 'DIRCT_EXPRT_DSCNT') {
                if (group.controls.brd.value == '') return { brdrequired: true };
            }
        }
        return null;
    }
    isLetterOfCreditRequired2(group: FormGroup): { [s: string]: boolean } | null {
        console.log('group', group);
        if (group) {
            if (group.controls.bills.value != 'SUB_SEQ_DSCNT') {
                if (group.controls.letterOfCredit.value == '')
                    return { letterOfCreditrequired: true };
            }
        }
        return null;
    }
    // isLetterOfCreditRequired3(group: FormGroup): { [s: string]: boolean } | null {
    //   console.log("group", group)
    //   if (group) {

    //     if (group.controls.bills.value == "ADV_PYMNT_RCVD") {
    //       if (group.controls.billpurchs.value == "")
    //         return { 'billpurchsrequired': true };
    //     }
    //   }
    //   return null;
    // }
    isbillpurchsRequired(group: FormGroup): { [s: string]: boolean } | null {
        if (group) {
            if (group.controls.bills.value == 'ADV_PYMNT_RCVD') {
                if (group.controls.billpurchs.value == 'FULL') return { billpurchsrequired: true };
            }
        }
        return null;
    }
    isbrdrequired() {
        if (this.submittedBillApplicant) {
            return this.billApplicantDetail.errors && this.billApplicantDetail.errors.brdrequired;
        }
        return false;
    }
   /*  isbillpurchsrequired() {
        if (this.submittedBillApplicant) {
            return (
                this.billApplicantDetail.errors &&
                this.billApplicantDetail.errors.billpurchsrequired
            );
        }
        return false;
    } */
    isletterOfCreditrequired() {
        if (this.submittedBillApplicant) {
            return (
                this.billApplicantDetail.errors &&
                this.billApplicantDetail.errors.letterOfCreditrequired
            );
        }
        return false;
    }

    inputChange(event: any) {
        this.amount = event.target.value;
        this.amntWords = this.fh.convertNumberToWords(this.amount);
        this.billApplicantDetail.controls.amntWords.setValue(this.amntWords);
    }

    partialChange() {
        this.resetOtherDetails();
        if (this.billApplicantDetail.value.bills == 'DIRCT_EXPRT_BIL') {
            this.partial = true;
        } else {
            this.partial = false;
        }
    }
    get appUserVal() {
        return this.billApplicantDetail.value;
    }
    formError(controlName: any) {
        if (this.submittedBillApplicant) {
            return this.fh.formInputError(this.billApplicantDetail, controlName);
        }
        return '';
    }

    ngAfterViewInit() {
        if (this.comservice.getAuthKey()) {
            this.billApplicantDetail.patchValue({
                exportBillsCustDtlsVo: {
                    //   custId: atob(this.comservice.getAuthKey()),
                    dpCode: this.comservice.getBranchCode()
                }
            });
            this.accountNumberList = this.comservice.getAccountNo()
        }
        setTimeout(() => {
            this.ref.detectChanges();
            this.getChange({});
        }, 1000);
    }
    resetOtherDetails() {
        this.billApplicantDetail.patchValue({
            billpurchs: '',
        });
    }
    getChange(dataProp: any) {
        this.comservice.getApplicantDetails(this.comservice.getAuthKey())
            .subscribe(
                data2 => {
                    let data = data2;
                    if(typeof(data2.body) == "string"){
                      data = { body: JSON.parse(data2.body) };
                    }
                    if (
                        data &&
                        data.body &&
                        // data.body.Response &&
                        data.body.CustomerInfoResponse
                    ) {
                        const rsp = data.body;
                        const rcData = rsp.CustomerInfoResponse;
                        const client = rsp.client;
                        const Cust=rcData.CustomerFullName.slice(0,35);
                        console.log(Cust);
                        this.billApplicantDetail.patchValue({
                            exportBillsCustDtlsVo: {
                                custId: client,
                                custNm:Cust,
                               /*  custNm: typeof rcData.CustomerFullName != 'object'? rcData.CustomerFullName : '', */
                                mobNo: typeof rcData.Phone != 'object' ? rcData.Phone : '',
                                eMail: typeof rcData.EmailId != 'object' ? rcData.EmailId : '',
                                address1: typeof rcData.Address1 != 'object' ? rcData.Address1 : '',
                                address2: typeof rcData.Address2 != 'object' ? rcData.Address2 : '',
                                address3: typeof rcData.Address3 != 'object' ? rcData.Address3 : '',
                                panNo: typeof rcData.PANCardNo != 'object' ? rcData.PANCardNo : '',
                                ieCode: typeof rcData.IECCode != 'object' ? rcData.IECCode : '',
                            },
                        });
                    }
                },
                err => { }
            );
    }
    onSubmitApp() {
        this.submittedBillApplicant = true;
        if (this.billApplicantDetail.valid) {
            this.appEvent.emit(this.billApplicantDetail.value);
        }
    }

    takeAction(event: any) {
        if (event.target.value == 'SUB_SEQ_DSCNT') {
            this.hideValue = true;
        } else {
            this.hideValue = false;
        }
        if (event.target.value == 'SUB_SEQ_DSCNT') {
            this.partial = true;
        } else {
            this.partial = false;
        }

        if (event.target.value == 'DIRCT_EXPRT_DSCNT') {
            this.hideBrdSecond = true;
        } else {
            this.hideBrdSecond = false;
        }

        if (event.target.value == 'DIRCT_EXPRT_DSCNT') {
            this.billApplicantDetail.patchValue({
                letterOfCredit: '',
            });
        } else if (event.target.value == 'BIL_PURCHS_COLCTN') {
            this.billApplicantDetail.patchValue({
                letterOfCredit: '',
                whrLcIsRcvByCN: '',
                brd: '',
            });
        } else if (event.target.value == 'EXPRT_COLCTN_BIL' || 'DIRCT_EXPRT_BIL') {
            this.billApplicantDetail.patchValue({
                letterOfCredit: '',
                whrLcIsRcvByCN: '',
                brd: '',
            });
        }

        this.informParent.emit(event.target.value);
        this.radioAction = event.target.value;
        if (
            this.radioAction == 'EXPRT_COLCTN_BIL' ||
            'DIRCT_EXPRT_BIL' ||
            'BIL_PURCHS_COLCTN' ||
            'DIRCT_EXPRT_DSCNT' ||
            'SUB_SEQ_DSCNT'
        ) {
            return (this.radioAction = true);
        } else return (this.radioAction = false);
    }
    onChange(event: any) {
        if (event.target.value == 'NO') {
            this.billApplicantDetail.patchValue({
                whrLcIsRcvByCN: '',
            });
        }
    }

  
}
