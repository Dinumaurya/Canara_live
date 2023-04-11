import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';

@Component({
  selector: 'sb-lc-shipment-detail',
  templateUrl: './lc-shipment-detail.component.html',
  styleUrls: ['./lc-shipment-detail.component.scss']
})
export class LcShipmentDetailComponent implements AfterViewInit {
  @Output('shipmentEvent') shipmentEvent = new EventEmitter();
  @ViewChild("content", { static: false }) content: any;
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  public amount: string;
  public enablee: boolean = false;
  public submittedlcFormship: boolean = false;
  public lcshipmentDetails: FormGroup;
  public isDisabled!: boolean;
  public incotermsList: any = [];
  public hsccode: any = [];
  public selcetdValue: any;
  public mandatory3Tab: any;
  public clicked = false;
  public modal_title = "Status"
  public modal_body = "Please correct form";
  public modal_body_2 = "";
  constructor(
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private modalService: NgbModal,
  ) {
    this.amount = '';
    this.lcshipmentDetails = this.formBuilder.group({
      lCShipDtlsVo: this.formBuilder.group({
        descGdsRmrks: new FormControl('', [Validators.required]),
        plRcpt: new FormControl('', []),
        pol: new FormControl('', [Validators.required]),
        pod: new FormControl('', [Validators.required]),
        plDlvry: new FormControl('', []),
        ltstShpMntDt: new FormControl('', [Validators.required]),
        isSwiftCodeNotAvl: new FormControl(false, [Validators.required]),
        hsDesc: new FormControl('', [Validators.required]),
        hsCode: new FormControl('', [Validators.required]),
        proInvNo: new FormControl('', [Validators.required]),
        impLicNo: new FormControl('', []),
        dgftPolicy: new FormControl('', [Validators.required]),
        inCoTerms: new FormControl('', [Validators.required]),
      })
    })
  }


  ngAfterViewInit() {
    this.comservice.getIncoterms().subscribe(data => {
      if (data && data.subCommonMasterList) {
        this.incotermsList = data.subCommonMasterList;;
      } else {
        this.incotermsList = [{ "commonMstSubId": 96, "code": "EXW", "value": "EXW", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 8 }, { "commonMstSubId": 94, "code": "CIF", "value": "CIF", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 2 }, { "commonMstSubId": 97, "code": "FOB", "value": "FOB", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 11 }, { "commonMstSubId": 98, "code": "DAP", "value": "DAP", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 5 }, { "commonMstSubId": 95, "code": "CFR", "value": "CFR", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 1 }, { "commonMstSubId": 1046, "code": "CPT", "value": "CPT", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 4 }, { "commonMstSubId": 1049, "code": "DAT", "value": "DAT", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 7 }, { "commonMstSubId": 1045, "code": "CIP", "value": "CIP", "crUser": "BackEnd", "crDate": "2018-08-15T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 3 }, { "commonMstSubId": 1047, "code": "FAS", "value": "FAS", "crUser": "BackEnd", "crDate": "2018-08-19T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 9 }, { "commonMstSubId": 1048, "code": "FCA", "value": "FCA", "crUser": "BackEnd", "crDate": "2018-08-20T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 10 }, { "commonMstSubId": 1050, "code": "DDP", "value": "DDP", "crUser": "BackEnd", "crDate": "2018-08-23T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 6 }];
      }
    }, (err) => {
      this.incotermsList = [{ "commonMstSubId": 96, "code": "EXW", "value": "EXW", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 8 }, { "commonMstSubId": 94, "code": "CIF", "value": "CIF", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 2 }, { "commonMstSubId": 97, "code": "FOB", "value": "FOB", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 11 }, { "commonMstSubId": 98, "code": "DAP", "value": "DAP", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 5 }, { "commonMstSubId": 95, "code": "CFR", "value": "CFR", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 1 }, { "commonMstSubId": 1046, "code": "CPT", "value": "CPT", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 4 }, { "commonMstSubId": 1049, "code": "DAT", "value": "DAT", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 7 }, { "commonMstSubId": 1045, "code": "CIP", "value": "CIP", "crUser": "BackEnd", "crDate": "2018-08-15T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 3 }, { "commonMstSubId": 1047, "code": "FAS", "value": "FAS", "crUser": "BackEnd", "crDate": "2018-08-19T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 9 }, { "commonMstSubId": 1048, "code": "FCA", "value": "FCA", "crUser": "BackEnd", "crDate": "2018-08-20T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 10 }, { "commonMstSubId": 1050, "code": "DDP", "value": "DDP", "crUser": "BackEnd", "crDate": "2018-08-23T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 6 }];
    })
  }
  loadPurposeDtls() {
    const val = this.lcshipmentDetails.value;
    if (val.lCShipDtlsVo.hsCode != '') {
      this.comservice.hsCodeDescription(val.lCShipDtlsVo.hsCode).subscribe(data => {
        if (data && data != null) {
          this.lcshipmentDetails.patchValue({
            lCShipDtlsVo: {
              hsDesc: data.hsDesc
            }
          })
        } else {
          this.lcshipmentDetails.patchValue({
            lCShipDtlsVo: {
              hsDesc: "",
              hsCode: ""
            }
          })
          this.modal_body_2 = 'H.S. Code is invalid kindly refer the "View H.S. Code" link next to description';
          this.modalService.open(this.contentbodyred, { size: 'sm' });
        }
      })
    }
  }
  onSubmitlcship() {
    this.submittedlcFormship = true;
    if (this.lcshipmentDetails.valid) {
      this.shipmentEvent.emit(this.lcshipmentDetails.value)
    }
  }
  isImport() {

  }
  changeLicnce(event: any) {
    if (event.target.value == 'NO_IMP_LIC_NO') {
      this.lcshipmentDetails.patchValue({
        lCShipDtlsVo: {
          impLicNo: '',
        }
      });
    }
  }
  getValue(e: any) {
    if (e.target.value == "IMP_LIC_NO") {
      this.mandatory3Tab = "This field is required";
    } else if (e.target.value == "NO_IMP_LIC_NO") {
      return 0
    }
  }
  get AppUserVal() {
    return this.lcshipmentDetails.value;

  }
  onCheckbboxSelect(Event: any) {
    this.selcetdValue = Event.target.value
  }

  getlcErrornew(controlName: any) {
    if (this.submittedlcFormship) {
      return this.fh.formInputError(this.lcshipmentDetails, controlName);
    }
    return '';
  }

  hsCodeDoc(link: any) {
    try {
      const pt = environment.app_url
      window.open(pt + "/docDownload/" + link, '_blank');
    } catch (error) {
    }
  }
  onEdit() {
    this.lcshipmentDetails.value.lCShipDtlsVo.impLicNo.disable();
  }
}
