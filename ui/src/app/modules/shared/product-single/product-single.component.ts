import { Component } from '@angular/core';

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html'
})
export class ProductSingleComponent {
  coffeeFlavors = [
    { value: 'caramel', label: 'Caramel' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'hazelnut', label: 'Hazelnut' },
    { value: 'mocha', label: 'Mocha' },
    { value: 'irish-cream', label: 'Irish Cream' }
  ];

  sweetnessLevels = [
    { value: 'none', label: 'None' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
  

}
