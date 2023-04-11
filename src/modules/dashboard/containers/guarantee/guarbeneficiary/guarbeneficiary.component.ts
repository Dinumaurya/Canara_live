import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';

@Component({
  selector: 'sb-guarbeneficiary',
  templateUrl: './guarbeneficiary.component.html',
  styleUrls: ['./guarbeneficiary.component.scss']
})
export class GuarbeneficiaryComponent implements OnInit {
  @Input() country = [];
  @Input() currency = [];
  @Output('benificiaryGuarEvent') benificiaryGuarEvent = new EventEmitter();
  @ViewChild("content", { static: false }) content: any;
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  public modal_title = "Status"
  public modal_body = "Please correct form";
  public modal_body_2 = "";
  public amount: any;
  public amntWords: any;
  public beneficiaryList: any = [];
  public guaranteeficiaryForm: FormGroup;
  public submittedguaranteeFrom3: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    public fh: FormHelperService,
    private modalService: NgbModal,
  ) {
    this.guaranteeficiaryForm = this.formBuilder.group({
      draftTenor: new FormControl('', [Validators.required]),
      tpSecurity: new FormControl('', [Validators.required]),
      hsDesc: new FormControl('', [Validators.required]),
      hsCode: new FormControl('', [Validators.required]),
      othrTransBnkVo: this.formBuilder.group({
        bnkNm: new FormControl('', [Validators.required]),
        cntryId: new FormControl('', [Validators.required]),
        fullAddr: new FormControl('', [Validators.required]),
        fullAddr2: new FormControl('', [Validators.required]),
        fullAddr1: new FormControl('', [Validators.required]),
        cifId: new FormControl(39956420, [Validators.required]),
        swiftCode: new FormControl('', [Validators.required]),
      }),
      guaranteeBnfDtlsVo: this.formBuilder.group({
        addr2: new FormControl('', [Validators.required]),
        addr1: new FormControl('', [Validators.required]),
        addr3: new FormControl('', [Validators.required]),
        cifId: new FormControl(39956420, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        cntryNm: new FormControl('', [Validators.required]),
        pinCode: new FormControl('', [Validators.required]),
      }),
    });
  }
  getBeneError(controlName: any) {
    if (this.submittedguaranteeFrom3) {
      return this.fh.formInputError(this.guaranteeficiaryForm, controlName);
    }
    return '';
  }
  ngOnInit(): void {
    this.getBeneficiaryDetails();
    this.loadDefaultBeneficiary()
  }
  loadDefaultBeneficiary() {
    this.comservice.getBeneDetails().subscribe(data => {
      this.beneficiaryList = data;
    })
  }
  beneficiarySelected() {
    const val = this.guaranteeficiaryForm.value;
    const found = this.beneficiaryList.find((o: any) => o.beneNam === val.othrTransBnkVo.bnkNm);
    const found1 = this.beneficiaryList.find((o: any) => o.beneNam === val.guaranteeBnfDtlsVo.name);
    if (found && found.addr1) {
      this.guaranteeficiaryForm.patchValue({
        othrTransBnkVo: {
          bnkNm: found.bnkNm,
          cntryId: found.countryName,
          fullAddr: found.addr3,
          fullAddr2: found.addr2,
          fullAddr1: found.addr1,
          swiftCode: found.swiftCode,
        },
        guaranteeBnfDtlsVo: {
          addr2: found1.addr2,
          addr1: found1.addr1,
          addr3: found1.addr3,
          name: found1.name,
          cntryNm: found1.countryName,
          pinCode: found1.zipCode,
        }
      })
    }
  }
  getBeneficiaryDetails() {
    try {
      const dt = this.guaranteeficiaryForm.value.guaranteeCustDtlsVo.custId
      const jsn: any = sessionStorage.getItem('user');
      const customerId = JSON.parse(jsn);
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        var UserId = customerId.ibData.UserID
      }
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        this.comservice.getBeneficiaryDetails(dt, 'FTB', UserId)
          .subscribe(data => {
            if (data.beneDetails) {
              this.beneficiaryList = data.beneDetails;
              console.log(this.beneficiaryList);
            }
          },
            (err) => {
              // this.spinner.hide();
              // this.loadDefaultBeneficiary();
            }
          )
      }
    } catch (error) {
      // console.log(error);
    }

  }
  loadPurposeDtls() {
    const val = this.guaranteeficiaryForm.value;
    if (val.hsCode != '') {
      this.comservice.purposeCodeDesciption(val.hsCode).subscribe(data => {
        if (data && data != null) {
          this.guaranteeficiaryForm.patchValue({
            hsDesc: data.hsDesc
          })
        } else {
          this.guaranteeficiaryForm.patchValue({
            hsDesc: "",
            hsCode:""
          })
          this.modal_body_2 = 'H.S. Code is invalid kindly refer the "View H.S. Code" link next to description';
          this.modalService.open(this.contentbodyred, { size: 'sm' });
        }
      })
    }
  }
  hsCodeDoc(link: any) {
    try {
      const pt = environment.app_url
      window.open(pt + "/docDownload/" + link, '_blank');
    } catch (error) {
    }
  }
  onSubmitForm2() {
    this.submittedguaranteeFrom3 = true;
    if (this.guaranteeficiaryForm.valid) {
      this.benificiaryGuarEvent.emit(this.guaranteeficiaryForm.value)
      return true;
    }
    return false;
  }
  inputChange(event: any) {
    this.amount = event.target.value;
    this.amntWords = this.convertNumberToWords(this.amount)
    this.guaranteeficiaryForm.controls['amntWords'].setValue(this.amntWords);
  }
  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);
  }
}
