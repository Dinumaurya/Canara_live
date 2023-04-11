import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // use import {NgIdleModule} from '@ng-idle/core'; if not using keepalive

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormHelperService } from './helper/form.helper';
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        NgIdleKeepaliveModule.forRoot() // use NgIdleModule.forRoot() if not using keepalive
    ],
    providers: [FormHelperService],
    bootstrap: [AppComponent],
})
export class AppModule { }
