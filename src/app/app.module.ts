import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon'
import {InputMaskModule} from 'primeng/inputmask';
import { RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule }   from '@angular/forms';
import { CalendarModule } from "primeng/calendar";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import {ChipsModule} from 'primeng/chips';


import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ChipsModule,
    HttpClientModule,
    InputMaskModule,
    InputTextModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTableModule,
    MatToolbarModule,
    RouterModule,
    MatDialogModule,
    CalendarModule,
    TableModule,
    ToastModule,
    FormsModule,
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
