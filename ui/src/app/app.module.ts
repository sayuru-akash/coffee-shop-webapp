import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from './modules/shared/shared.module';
import { ProductSingleComponent } from './modules/shared/product-single/product-single.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { OrdersComponent } from './pages/admin/orders/orders.component';
import { AuthModule } from './pages/auth/auth.module';
import { PagesModule } from './pages/pages.module';

const routes = [
  { path: '', component: PagesModule },
  { path: 'product/:id', component: ProductSingleComponent},
  { path: 'admin/users', component: UsersComponent},
  { path: 'admin/products', component: ProductsComponent},
  { path: 'admin/categories', component: CategoriesComponent},
  { path: 'admin/orders', component: OrdersComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    ProductsComponent,
    CategoriesComponent,
    OrdersComponent,
  ],
  imports: [
    SharedModule,
    AuthModule,
    PagesModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
