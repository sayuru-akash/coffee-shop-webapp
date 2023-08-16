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
      link: ''
    },
    {
      icon: 'fa-file',
      text: 'Products',
      link: ''
    },
    {
      icon: 'fa-layer-group',
      text: 'Categories',
      link: ''
    },
    {
      icon: 'fa-hand-holding-dollar',
      text: 'Orders',
      link: ''
    },
    {
      icon: 'fa-users',
      text: 'Users',
      link: ''
    },
    {
      icon: 'fa-gear',
      text: 'Settings',
      link: ''
    }
  ];
}
