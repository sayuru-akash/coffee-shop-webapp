import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebarComponent {
  sidebarItems = [
    {
      icon: 'fa-tachometer-alt',
      text: 'Dashboard',
      link: '/admin',
    },
    {
      icon: 'fa-coffee',
      text: 'Products',
      link: '/admin/products',
    },
    {
      icon: 'fa-list',
      text: 'Categories',
      link: '/admin/categories',
    },
    {
      icon: 'fa-shopping-cart',
      text: 'Orders',
      link: '/admin/orders',
    },
    {
      icon: 'fa-users',
      text: 'Users',
      link: '/admin/users',
    },
    {
      icon: 'fa-cog',
      text: 'Log Out',
      link: '/logout',
    },
  ];
}
