import { from } from 'rxjs';

import { AdvanceRemComponent } from './advance-rem/advance-rem.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InlandlcformComponent } from './inlandlcform/inlandlcform.component';
import { LandingFormComponent } from './landing-form/landing-form.component';
import { LcFormComponent } from './lcform/lcform.component';
import { OutwardCreateComponent } from './outward-create/outward-create.component';
import { OutwardRemittanceComponent } from './outward-remittance/outward-remittance.component';

export const containers = [
    DashboardComponent,
    OutwardRemittanceComponent,
    OutwardCreateComponent,
    LcFormComponent,
    AdvanceRemComponent,
    LandingFormComponent,
];

export * from './dashboard/dashboard.component';
export * from './outward-remittance/outward-remittance.component';
export * from './outward-create/outward-create.component';
export * from './lcform/lcform.component';
export * from './advance-rem/advance-rem.component';
export * from './outward-remittance/outward-remittance.component';
export * from './lc-outward-remmitance/lc-outward-remmitance.component';
export * from './export-outward-rem/export-outward-rem.component';
export * from './exports/exports.component';
export * from './bill-collection/bill-collection.component';
export * from './amendment-lc-form/amendment-lc-form.component';
export * from './import-bill-collection/import-bill-collection.component';
export * from './pcfc-outward-rem/pcfc-outward-rem.component';
export * from './cpcft/cpcft.component';
export * from './forward-cntct-list/forward-cntct-list.component';
export * from './forward-cntct/forward-cntct.component';
export * from './inlandlcform/inlandlcform.component';
export * from './landing-form/landing-form.component';

