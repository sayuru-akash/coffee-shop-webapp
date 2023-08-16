import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductSingleComponent } from './product-single/product-single.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ProductSingleComponent,
    AdminSidebarComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatIconModule,
    MatToolbarModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    AdminSidebarComponent
  ]
})
export class SharedModule { }
