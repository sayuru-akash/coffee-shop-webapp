import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart/cart.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HeroComponent } from '../components/hero/hero.component';
import { AuthModule } from './auth/auth.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditProductComponent } from './admin/products/edit-product/edit-product.component';
import { AddProductComponent } from './admin/products/add-product/add-product.component';

const routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart', component: CartComponent },
];

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    CheckoutComponent,
    CartComponent,
    HeroComponent,
    EditProductComponent,
    AddProductComponent,
  ],
  imports: [
    AuthModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    RouterModule.forRoot(routes),
  ],
  exports: [HomeComponent, MenuComponent, CheckoutComponent, CartComponent],
  providers: [],
})
export class PagesModule {}
