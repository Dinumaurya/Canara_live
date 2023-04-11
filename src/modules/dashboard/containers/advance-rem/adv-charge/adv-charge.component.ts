import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';

@Component({
  selector: 'sb-adv-charge',
  templateUrl: './adv-charge.component.html',
  styleUrls: ['./adv-charge.component.scss']
})
export class AdvChargeComponent implements OnInit {
  conversionList: any = [];

  conversationDetailTotal = 0;
  public conversationDetailForm1Total = 0;
  public conversationDetailForm1RcAmt = 0;
  advChargeDetails: FormGroup;
  public isDtlsofFrwdCntrct: boolean = false;

  submittedChargeForm4: boolean = false;
  @Output('advChargeEvent') advChargeEvent = new EventEmitter();
  @Input() currency = [];
  currentMode: any = 'edit';

  constructor(private formBuilder: FormBuilder, private comservice: AppCommonService,
    private dashboardService: DashboardService, public fh: FormHelperService,) {

    this.advChargeDetails = this.formBuilder.group({
      addInfo: new FormControl('', [Validators.required]),
    /*   Charges:new FormControl('', [Validators.required]), */
    });
  }
  public onAddRowConvrsion(): void {
    if ((this.conversionList == null || this.conversionList == undefined)) {
      this.conversionList = [];
    }
    this.conversionList.push({
      frwdCntrctNo: "",
      frwdCntrctDtlsId: 2677,
      srNo: null,
      fcy: "",
      orgnlAmnt: "",
      utlizAmnt: "",
      amntUtilizd: "",
      frgnBnkChrgs: "",
    });
  }
  deleteConversionDetail(index: any) {
    this.conversionList.splice(index, 1);
    this.getConversationDetailForm1Total();
  }
  onSubmitAddChargeForm4() {
    this.submittedChargeForm4 = true
    let isNoErrorConDet = true;
    if (this.isDtlsofFrwdCntrct) {
      this.conversionList.forEach((row: any) => {
        if (row.frwdCntrctNo == '') {
          row.frwdCntrctNoReq = true;
          isNoErrorConDet = false;
        } else {
          row.frwdCntrctNoReq = false;
        }
        if (row.fcy == '') {
          row.fcyReq = true;
          isNoErrorConDet = false;
        } else {
          row.fcyReq = false;
        }
        if (row.orgnlAmnt == '') {
          row.orgnlAmntReq = true;
          isNoErrorConDet = false;
        } else {
          row.orgnlAmntReq = false;
        }
        if (row.utlizAmnt == '') {
          row.utlizAmntReq = true;
          isNoErrorConDet = false;
        } else {
          row.utlizAmntReq = false;
        }
        if (row.amntUtilizd == '') {
          row.amntUtilizdReq = true;
          isNoErrorConDet = false;
        } else {
          row.amntUtilizdReq = false;
        }
        if (row.frgnBnkChrgs == '') {
          row.frgnBnkChrgsReq = true;
          isNoErrorConDet = false;
        } else {
          row.frgnBnkChrgsReq = false;
        }

      });
      if (this.conversionList.length == 0) {
        isNoErrorConDet = false;
      }
    }
    if (this.advChargeDetails.valid && isNoErrorConDet) {
      return true;
    }
    return false;
  }


  ngOnInit(): void {
  }
  istotalGreaterThanFc() {
    if (((+this.conversationDetailForm1Total) + (+this.conversationDetailTotal)) > this.advChargeDetails.value.amount) {
      return true;
    }
    return false;
  }
  getConversationDetailForm1Total() {
    let total = 0;
    if (this.conversionList && this.conversionList.length) {
      this.conversionList.forEach((element: any) => {
        total += (+element.amntUtilizd)
      });
    }
    this.conversationDetailForm1Total = total;
  }
  getChargeError(controlName: any) {
    if (this.submittedChargeForm4) {
      return this.fh.formInputError(this.advChargeDetails, controlName);
    }
    return '';
  }
  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }
  ChangeDetailTable(event: any) {
    if (event.target.checked == false) {
      this.conversionList = [];
      this.conversationDetailForm1Total = 0;
    }

  }
}
