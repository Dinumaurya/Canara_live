/* tslint:disable: ordered-imports*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/* Modules */
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { ChartsModule } from '@modules/charts/charts.module';
import { TablesModule } from '@modules/tables/tables.module';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
/* Components */
import * as dashboardComponents from './components';
/* Containers */
import * as dashboardContainers from './containers';
/* Guards */
import * as dashboardGuards from './guards';
/* Services */
import * as dashboardServices from './services';
fontLibrary.add(
    faCalendar,
    faClock
);
import { NgBootstrapDatetimeAngularModule } from "ng-bootstrap-datetime-angular";
import { NgxSpinnerModule } from "ngx-spinner";
import {
    NumbersOnly,
    NumberTwoDigitDirective,
    AlphabetOnlyDirective,
    ToastsContainer,
    ToastService,
    CharNumberDirective,
    CharNumberNoSpaceDirective,
    BaseInputComponent
} from "./common";
import {
    ChargeDetailComponent,
    LcApplicantDetailComponent,
    LcBeneficiaryDetailComponent,
    LcOfficeComponent,
    LcShipmentDetailComponent,
    PolicyComponent
} from "./containers/lcform/forms-pages";
import { LcFormComponent } from "./containers/lcform/lcform.component";

import { LcOutwardRemmitanceComponent } from './containers/lc-outward-remmitance/lc-outward-remmitance.component';

import { AdvApplicantDetailComponent } from './containers/advance-rem/adv-applicant-detail/adv-applicant-detail.component';
import { AdvShipmentDetailComponent } from './containers/advance-rem/adv-shipment-detail/adv-shipment-detail.component';
import { AdvBankBeneficiaryComponent } from './containers/advance-rem/adv-bank-beneficiary/adv-bank-beneficiary.component';
import { AdvChargeComponent } from './containers/advance-rem/adv-charge/adv-charge.component';
import { AdvPolicyComponent } from './containers/advance-rem/adv-policy/adv-policy.component';
import { AdvOfficeUseComponent } from './containers/advance-rem/adv-office-use/adv-office-use.component';
import { AdvanceRemComponent } from './containers/advance-rem/advance-rem.component';
import { AdvOutwardRemComponent } from './containers/adv-outward-rem/adv-outward-rem.component';
import { ExportsComponent } from './containers/exports/exports.component';
import { ExportOutwardRemComponent } from './containers/export-outward-rem/export-outward-rem.component';
import { ExportApplicantComponent } from './containers/exports/export-pages/export-applicant/export-applicant.component';
import { ExportShipmentComponent } from './containers/exports/export-pages/export-shipment/export-shipment.component';
import { ExportBankBeneficiaryComponent } from './containers/exports/export-pages/export-bank-beneficiary/export-bank-beneficiary.component';
import { ExportChargComponent } from './containers/exports/export-pages/export-charg/export-charg.component';
import { ExportPolicyComponent } from './containers/exports/export-pages/export-policy/export-policy.component';
import { ExportOfficeComponent } from './containers/exports/export-pages/export-office/export-office.component';
import { BillCollectionComponent } from './containers/bill-collection/bill-collection.component';
import { BillApplicantComponent } from './containers/bill-collection/bill-applicant/bill-applicant.component';
import { BillShipmentComponent } from './containers/bill-collection/bill-shipment/bill-shipment.component';
import { BillBankBeneficiaryComponent } from './containers/bill-collection/bill-bank-beneficiary/bill-bank-beneficiary.component';
import { BillChargeComponent } from './containers/bill-collection/bill-charge/bill-charge.component';
import { BillPolicyComponent } from './containers/bill-collection/bill-policy/bill-policy.component';
import { BillOfficeComponent } from './containers/bill-collection/bill-office/bill-office.component';
import { BillCollectionOutwardRemComponent } from './containers/bill-collection-outward-rem/bill-collection-outward-rem.component';
import { AmendmentLcFormComponent } from './containers/amendment-lc-form/amendment-lc-form.component';
import { AmendLcApplicantComponent } from './containers/amendment-lc-form/amend-lc-applicant/amend-lc-applicant.component';
import { AmendLcShipmentComponent } from './containers/amendment-lc-form/amend-lc-shipment/amend-lc-shipment.component';
import { AmendLcOfficeComponent } from './containers/amendment-lc-form/amend-lc-office/amend-lc-office.component';
import { CpcftComponent } from './containers/cpcft/cpcft.component';
import { CpfcFirstComponent } from './containers/cpcft/cpfc-first/cpfc-first.component';
import { ImportBillBankBeneComponent } from './containers/import-bill-collection/import-bill-bank-bene/import-bill-bank-bene.component';
import { ImportBillChargeComponent } from './containers/import-bill-collection/import-bill-charge/import-bill-charge.component';
import { ImportBillPolicyComponent } from './containers/import-bill-collection/import-bill-policy/import-bill-policy.component';
import { ImportBillOfficeComponent } from './containers/import-bill-collection/import-bill-office/import-bill-office.component';
import { ImportBillCollectionComponent } from './containers/import-bill-collection/import-bill-collection.component';
import { ImportBillApplicantComponent } from './containers/import-bill-collection/import-bill-applicant/import-bill-applicant.component';
import { ImportBillShipmentComponent } from './containers/import-bill-collection/import-bill-shipment/import-bill-shipment.component';
import { PcfcOutwardRemComponent } from './containers/pcfc-outward-rem/pcfc-outward-rem.component';
import { GuaranteeComponent } from './containers/guarantee/guarantee.component';
import { GuarApplicantComponent } from './containers/guarantee/guar-applicant/guar-applicant.component';
import { GuarbeneficiaryComponent } from './containers/guarantee/guarbeneficiary/guarbeneficiary.component';
import { OutwardGuaranteeComponent } from './containers/outward-guarantee/outward-guarantee.component';
import { GuarChargeComponent } from './containers/guarantee/guar-charge/guar-charge.component';
import { GuarOfficeComponent } from './containers/guarantee/guar-office/guar-office.component';
import { ImportBillCollectionOutwardComponent } from './containers/import-bill-collection-outward/import-bill-collection-outward.component';
import { ForwardCntctComponent } from './containers/forward-cntct/forward-cntct.component';
import { ForwardCntctListComponent } from './containers/forward-cntct-list/forward-cntct-list.component';
import { ModalContentComponent } from './containers/base.admin.component';
import { ChargedetailComponent } from './containers/inlandlcform/formspages/chargedetail/chargedetail.component';
import { ApplicantdetailComponent } from './containers/inlandlcform/formspages/applicantdetail/applicantdetail.component';
import { BenedetailComponent } from './containers/inlandlcform/formspages/benedetail/benedetail.component';
import { ShipdetailComponent } from './containers/inlandlcform/formspages/shipdetail/shipdetail.component';
import { PoliComponent } from './containers/inlandlcform/formspages/poli/poli.component';
import { OfficedetailComponent } from './containers/inlandlcform/formspages/officedetail/officedetail.component';
import { InlandlcformComponent } from './containers';
import { LCInlandComponent } from './containers/lc-inland/lc-inland.component';
import { LandingFormComponent } from './containers/landing-form/landing-form.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        AppCommonModule,
        NavigationModule,
        ChartsModule,
        TablesModule,
        NgbModule,
        NgBootstrapDatetimeAngularModule,
        NgxSpinnerModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

    providers: [...dashboardServices.services, ...dashboardGuards.guards, ToastService],
    declarations: [
        ...dashboardContainers.containers,
        ...dashboardComponents.components,
        NumbersOnly,
        AlphabetOnlyDirective,
        NumberTwoDigitDirective,
        ToastsContainer,
        ChargeDetailComponent,
        LcApplicantDetailComponent,
        LcBeneficiaryDetailComponent,
        LcOfficeComponent,
        LcShipmentDetailComponent,
        PolicyComponent,
        LcFormComponent,
        LcOutwardRemmitanceComponent,
        AdvanceRemComponent,
        AdvApplicantDetailComponent,
        AdvShipmentDetailComponent,
        AdvBankBeneficiaryComponent,
        AdvChargeComponent,
        AdvPolicyComponent,
        AdvOfficeUseComponent,
        AdvOutwardRemComponent,
        ExportsComponent,
        ExportOutwardRemComponent,
        ExportApplicantComponent,
        ExportShipmentComponent,
        ExportBankBeneficiaryComponent,
        ExportChargComponent,
        ExportPolicyComponent,
        ExportOfficeComponent,
        BillCollectionComponent,
        BillApplicantComponent,
        BillShipmentComponent,
        BillBankBeneficiaryComponent,
        BillChargeComponent,
        BillPolicyComponent,
        BillOfficeComponent,
        BillCollectionOutwardRemComponent,
        AmendmentLcFormComponent,
        AmendLcApplicantComponent,
        AmendLcShipmentComponent,
        AmendLcOfficeComponent,
        CpcftComponent,
        CpfcFirstComponent,
        ImportBillCollectionComponent,
        ImportBillApplicantComponent,
        ImportBillShipmentComponent,
        ImportBillBankBeneComponent,
        ImportBillPolicyComponent,
        ImportBillOfficeComponent,
        ImportBillChargeComponent,
        PcfcOutwardRemComponent,
        GuaranteeComponent,
        GuarApplicantComponent,
        GuarbeneficiaryComponent,
        OutwardGuaranteeComponent,
        GuarChargeComponent,
        GuarOfficeComponent,
        ImportBillCollectionOutwardComponent,
        ForwardCntctComponent,
        ForwardCntctListComponent,
        CharNumberDirective,
        CharNumberNoSpaceDirective,
        BaseInputComponent,
        ModalContentComponent,
        ChargedetailComponent,
        ApplicantdetailComponent,
        BenedetailComponent,
        ShipdetailComponent,
        PoliComponent,
        OfficedetailComponent,
        InlandlcformComponent,
        LCInlandComponent,
        LandingFormComponent,
      
    ],
    exports: [...dashboardContainers.containers, ...dashboardComponents.components],
})
export class DashboardModule { }
