import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  links = [
    { title: 'Home', url: '' },
    { title: 'Menu', url: 'menu' }
  ];

}
