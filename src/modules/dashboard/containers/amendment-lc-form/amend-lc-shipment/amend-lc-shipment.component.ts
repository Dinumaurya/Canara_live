import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';

@Component({
  selector: 'sb-amend-lc-shipment',
  templateUrl: './amend-lc-shipment.component.html',
  styleUrls: ['./amend-lc-shipment.component.scss']
})
export class AmendLcShipmentComponent implements OnInit {
  public submittedlcForm2: boolean=false;
  public amendShipmentDetails:FormGroup
  amount: string;
  constructor(private ref: ChangeDetectorRef, public fh: FormHelperService,
    private formBuilder: FormBuilder, private comservice: AppCommonService,
    private dashboardService: DashboardService) {
    this.amount = '';

    var address3
    const email = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
    const pan = '[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}';
    const phone = '[6-9]\\d{9}'
    const sysdate =
      '^(0?[1-9]|[12][0-9]|3[01])-(jan|Jan|JAN|feb|Feb|FEB|mar|Mar|MAR|apr|Apr|APR|may|May|MAY|jun|Jun|JUN|jul|Jul|JUL|aug|Aug|AUG|sep|Sep|SEP|oct|Oct|OCT|nov|Nov|NOV|dec|Dec|DEC)-(19|20)dds([0-1][0-9]|[2][0-3]):([0-5][0-9])$';
    const dt = new Date();
    const customerName = '^[a-zA-Z]+$';

    this.amendShipmentDetails = this.formBuilder.group({
     
      srInformation: new FormControl('', [Validators.required]),
      addCondition: new FormControl('', []),
      docReqByCust: new FormControl('', [Validators.required]),
      otherPlace: new FormControl('', [Validators.required]),
      otherDate: new FormControl('', [Validators.required]),

      shipDtlsVo: this.formBuilder.group({
        proInvNo: new FormControl('', [Validators.required]),
        plRcpt: new FormControl('', [Validators.required]),
        pol: new FormControl('', [Validators.required]),
        pod: new FormControl('', [Validators.required]),
        plDlvry: new FormControl('', []),
        prtlShpmntAllwd: new FormControl('', []),
        transShpmntAllwd: new FormControl('', []),
      }),
    });
  }
  ngOnInit() {
   
  }
  @Output('ammentappShipmentEvent') ammentappShipmentEvent = new EventEmitter();

  getEmdErrorship(controlName: any) {
    if (this.submittedlcForm2) {
      return this.fh.formInputError(this.amendShipmentDetails, controlName);
    }
    return '';
  }

  onSubmitShipApp() {
   
    
    this.submittedlcForm2 = true;
 
    if (this.amendShipmentDetails.valid) {
      this.ammentappShipmentEvent.emit(this.amendShipmentDetails.value)
    }
  }


  get AppUserVal() {
    return this.amendShipmentDetails.value;
  }

}
