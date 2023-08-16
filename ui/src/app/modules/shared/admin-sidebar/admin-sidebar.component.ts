import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebarComponent {
  sidebarItems = [
    {
      icon: 'fa-grip',
      text: 'Dashboard',
      link: '/admin'
    },
    {
      icon: 'fa-file',
      text: 'Products',
      link: '/admin/products'
    },
    {
      icon: 'fa-layer-group',
      text: 'Categories',
      link: '/admin/categories'
    },
    {
      icon: 'fa-hand-holding-dollar',
      text: 'Orders',
      link: '/admin/orders'
    },
    {
      icon: 'fa-users',
      text: 'Users',
      link: '/admin/users'
    },
    {
      icon: 'fa-gear',
      text: 'Settings',
      link: '/admin/settings'
    }
  ];
}
