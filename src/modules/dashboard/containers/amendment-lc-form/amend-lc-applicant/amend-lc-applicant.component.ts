import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';
import { DashboardService } from '@modules/dashboard/services';

@Component({
  selector: 'sb-amend-lc-applicant',
  templateUrl: './amend-lc-applicant.component.html',
  styleUrls: ['./amend-lc-applicant.component.scss']
})
export class AmendLcApplicantComponent implements OnInit, AfterViewInit {
  amount: string;
  lcappUserDetails: FormGroup;
  submittedlcForm1: boolean = false;
  @Input() country = [];
  @Input() currency = [];
  accountNumberList: any = [];
  public lcTransBnkVo: any = []
  @Output('ammentappEvent') ammentappEvent = new EventEmitter();
  amntWords: any;
  trans: boolean = false;
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

    this.lcappUserDetails = this.formBuilder.group({
      sysRefNo: new FormControl('', []),
      transRefNo: new FormControl('', []),
      sysRefDt: new FormControl(dt, [Validators.required]), //, Validators.pattern(sysdate)
      amount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      amntWords :  new FormControl('', [Validators.required]),
      amendmentDt: new FormControl('', [Validators.required]),
      amendmentNo: new FormControl('', [Validators.required]),
      lcaLatestShipDate: new FormControl('', [Validators.required]),
      lcaLastAmdDate: new FormControl('', [Validators.required]),
      lcaExpiryDate: new FormControl('', [Validators.required]),
      chngeTolerenace: new FormControl('', [Validators.required]),
      lcRefNo: new FormControl('', [Validators.required]),
      issueDate: new FormControl('', [Validators.required]),
      lcExpiryDate: new FormControl('', [Validators.required]),
      lcCcy: new FormControl('', [Validators.required]),
      lcAmount: new FormControl('', [Validators.required]),


    });
  }
  ngAfterViewInit() {
    
  }
  ngOnInit(): void {

  }

  getError(controlName: any) {
    if (this.submittedlcForm1) {
      return this.fh.formInputError(this.lcappUserDetails, controlName);
    }
    return '';
  }
  inputChange(event: any) {
    this.amount = event.target.value;

    this.amntWords = this.convertNumberToWords(this.amount)
    // this.lcappUserDetails.controls['amntWords'].value = this.amount;
    this.lcappUserDetails.controls['amntWords'].setValue(this.amntWords);
    
  }
  onSubmitApp() {
   
    
    this.submittedlcForm1 = true;
 
    if (this.lcappUserDetails.valid) {
      this.ammentappEvent.emit(this.lcappUserDetails.value)
    }
  }


  get AppUserVal() {
    return this.lcappUserDetails.value;
  }

  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);

  }

}
