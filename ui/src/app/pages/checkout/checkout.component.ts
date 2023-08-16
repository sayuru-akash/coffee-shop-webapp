import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  pickupLocations = ['Location 1', 'Location 2', 'Location 3', 'Location 4'];
  cartItems = [
    {
      imgSrc: 'https://globalassets.starbucks.com/digitalassets/products/bev/Oleato_GoldenFoam_ColdBrew.jpg?impolicy=1by1_tight_288%22',
      name: 'Oat Milk',
      category: 'Cold Drinks',
      quantity: 1
    },
    {
      imgSrc: 'https://globalassets.starbucks.com/digitalassets/products/bev/Oleato_GoldenFoam_ColdBrew.jpg?impolicy=1by1_tight_288%22',
      name: 'Latte',
      category: 'Hot Coffees',
      quantity: 2
    },
    // Add more drink items with properties
  ];
}
