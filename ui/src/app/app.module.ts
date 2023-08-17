import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AuthGuard } from './auth-guard.service';
import { NgxWebsocketModule } from 'ngx-websocket';

const routes = [
  { path: '', component: PagesModule },
  { path: 'menu/:id', component: ProductSingleComponent },
  { path: 'admin', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/users', component: UsersComponent, canActivate: [AuthGuard] },
  {
    path: 'admin/products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    ProductsComponent,
    CategoriesComponent,
    OrdersComponent,
    DashboardComponent,
  ],
  imports: [
    SharedModule,
    NgxWebsocketModule,
    AuthModule,
    FormsModule,
    PagesModule,
    BrowserModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
