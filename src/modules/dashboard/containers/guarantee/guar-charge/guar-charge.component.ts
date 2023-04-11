import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';

@Component({
  selector: 'sb-guar-charge',
  templateUrl: './guar-charge.component.html',
  styleUrls: ['./guar-charge.component.scss']
})
export class GuarChargeComponent implements OnInit  {

  @Output('chargeEvent') chargeEvent = new EventEmitter();


  GuarChargeDetails: FormGroup;

  amount: string; myData: any;
  submittedForm4: boolean = false;
  submittedGuarForm4: boolean = false;
  selectedRadio: any;




  constructor(private ref: ChangeDetectorRef, public fh: FormHelperService,
    private formBuilder: FormBuilder, private comservice: AppCommonService) {



    this.amount = '';
    const email = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
    const pan = '[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}';
    const phone = '[6-9]\\d{9}'
    const sysdate =
      '^(0?[1-9]|[12][0-9]|3[01])-(jan|Jan|JAN|feb|Feb|FEB|mar|Mar|MAR|apr|Apr|APR|may|May|MAY|jun|Jun|JUN|jul|Jul|JUL|aug|Aug|AUG|sep|Sep|SEP|oct|Oct|OCT|nov|Nov|NOV|dec|Dec|DEC)-(19|20)dds([0-1][0-9]|[2][0-3]):([0-5][0-9])$';
    const dt = new Date();
    const customerName = '^[a-zA-Z]+$';



    this.GuarChargeDetails = this.formBuilder.group({
      formPlace: new FormControl('', []),
      formDt: new FormControl('', []),
      guaranteeChrgDtlsVo: this.formBuilder.group({
        addCondition: new FormControl('', [Validators.required]),
        sndrRcvrInfo: new FormControl('', [Validators.required]),
        pymntInstruc: new FormControl('', [Validators.required]),
        accOf: new FormControl('', []),
        accOf2: new FormControl('', []),
        chrgCnfrm: new FormControl('', [Validators.required]),
        cnfrmChrsAccOf: new FormControl('', [Validators.required]),
        docReq:new FormControl('', []),
      })
    })
  }
  ngOnInit(): void {
  }
  get chargeValue() {
    return this.GuarChargeDetails.value.guaranteeChrgDtlsVo;
  }
  onSubmitForm4() {

    this.submittedGuarForm4 = true;
   
    if (this.GuarChargeDetails.valid ) {
      this.chargeEvent.emit(this.GuarChargeDetails.value)
    }
  }
  onCheckbboxSelect(event: any) {
    this.selectedRadio = event.target.value

  }
  getlcErrorCon(controlName: any) {
    if (this.submittedGuarForm4) {
      return this.fh.formInputError(this.GuarChargeDetails, controlName);
    }
    return '';
  }
  getWithout(control: any) {

    if (this.selectedRadio == 'WITH') {
      const val = this.chargeValue[control];
      if (val == '' || val == null) {
        return this.submittedGuarForm4 && true;
      }
      return false;
    }
  }
}

