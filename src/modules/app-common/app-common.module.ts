/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/* Third Party */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from '@modules/icons/icons.module';

const thirdParty = [IconsModule, NgbModule];

/* Containers */
import * as appCommonContainers from './containers';

/* Components */
import * as appCommonComponents from './components';

/* Guards */
import * as appCommonGuards from './guards';

/* Services */
import * as appCommonServices from './services';
import * as authServices from '@modules/auth/services';
import { AlphanumericDirective } from './services/alphanumeric.directive';

@NgModule({
    imports: [CommonModule, RouterModule, ...thirdParty],
    providers: [...appCommonServices.services, ...authServices.services, ...appCommonGuards.guards],
    declarations: [...appCommonContainers.containers, ...appCommonComponents.components, AlphanumericDirective],
    exports: [...appCommonContainers.containers, ...appCommonComponents.components, ...thirdParty],
})
export class AppCommonModule {}
