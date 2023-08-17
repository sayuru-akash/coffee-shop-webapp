import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { LogoutGuard } from 'src/app/logout.guard';

const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', canActivate: [LogoutGuard], component: LoginComponent },
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserModule,
    MatCheckboxModule,
    RouterModule.forRoot(routes),
  ],
  exports: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
