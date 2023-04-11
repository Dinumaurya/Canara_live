import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';

@Component({
    selector: 'sb-charge-detail',
    templateUrl: './charge-detail.component.html',
    styleUrls: ['./charge-detail.component.scss'],
})
export class ChargeDetailComponent implements OnInit {
    @Output('chargeEvent') chargeEvent = new EventEmitter();

    lcChargeDetails: FormGroup;

    amount: string;
    myData: any;
    submittedForm4 = false;
    submittedlcForm4 = false;
    selectedRadio: any;

    constructor(
        private ref: ChangeDetectorRef,
        public fh: FormHelperService,
        private formBuilder: FormBuilder,
        private comservice: AppCommonService
    ) {
        this.amount = '';
        const email = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
        const pan = '[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}';
        const phone = '[6-9]\\d{9}';
        const sysdate =
            '^(0?[1-9]|[12][0-9]|3[01])-(jan|Jan|JAN|feb|Feb|FEB|mar|Mar|MAR|apr|Apr|APR|may|May|MAY|jun|Jun|JUN|jul|Jul|JUL|aug|Aug|AUG|sep|Sep|SEP|oct|Oct|OCT|nov|Nov|NOV|dec|Dec|DEC)-(19|20)dds([0-1][0-9]|[2][0-3]):([0-5][0-9])$';
        const dt = new Date();
        const customerName = '^[a-zA-Z]+$';

        this.lcChargeDetails = this.formBuilder.group({
            lCChrgDtlsVo: this.formBuilder.group({
                addCondition: new FormControl('', [
                    Validators.required,
                    Validators.pattern(this.fh.CUSTOMER_NAME_REG),
                ]),
                docReq: new FormControl('', [
                  Validators.required,
                   Validators.pattern(this.fh.CUSTOMER_NAME_REG)
                  ]),
                sndrRcvrInfo: new FormControl('', []),
                pymntInstruc: new FormControl('', [Validators.required]),
                accOf: new FormControl('', [Validators.required]),
                prdPresentation: new FormControl('', [Validators.required]),
                chrgCnfrm1: new FormControl('', []),
                chrgCnfrm: new FormControl('', []),
                cnfrmChrsAccOf: new FormControl('', []),
            }),
        });
    }
    ngOnInit(): void {}
    get chargeValue() {
        return this.lcChargeDetails.value.lCChrgDtlsVo;
    }
    onSubmitForm4() {
        this.submittedlcForm4 = true;
        this.myData = this.lcChargeDetails.value;
        if (this.lcChargeDetails.valid && !this.getWithout('cnfrmChrsAccOf')) {
            this.chargeEvent.emit(this.lcChargeDetails.value);
        }
    }
    onCheckbboxSelect(event: any) {
        this.selectedRadio = event.target.value;
        if (this.selectedRadio == 'WITHOUT') {
            this.lcChargeDetails.patchValue({
                lCChrgDtlsVo: {
                    cnfrmChrsAccOf: '',
                },
            });
        }
    }
    getlcErrorCon(controlName: any) {
        if (this.submittedlcForm4) {
            return this.fh.formInputError(this.lcChargeDetails, controlName);
        }
        return '';
    }
    getWithout(control: any) {
        if (this.selectedRadio == 'WITH') {
            const val = this.chargeValue[control];
            if (val == '' || val == null) {
                return this.submittedlcForm4 && true;
            }
            return false;
        }
    }
}
