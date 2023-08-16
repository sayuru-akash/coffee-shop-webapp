import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  categories = [
    {
        name: "Drinks",
        subcategories: [
            "Oleato™",
            "Hot Coffees",
            "Hot Teas",
            "Hot Drinks",
            "Frappuccino® Blended Beverages",
            "Cold Coffees",
            "Iced Teas",
            "Cold Drinks"
        ]
    },
    {
        name: "Food",
        subcategories: [
            "Hot Breakfast",
            "Oatmeal & Yogurt",
            "Bakery",
            "Lunch",
            "Snacks & Sweets"
        ]
    },
    {
        name: "At Home Coffee",
        subcategories: [
            "Whole Bean",
            "VIA® Instant"
        ]
    },
    {
        name: "Merchandise",
        subcategories: [
            "Cold Cups",
            "Tumblers",
            "Mugs",
            "Other"
        ]
    }
];

drinks = [
  {
    imgSrc: 'https://globalassets.starbucks.com/digitalassets/products/bev/Oleato_GoldenFoam_ColdBrew.jpg?impolicy=1by1_tight_288%22',
    name: 'Oat Milk'
  },
  {
    imgSrc: 'https://globalassets.starbucks.com/digitalassets/products/bev/Oleato_GoldenFoam_ColdBrew.jpg?impolicy=1by1_tight_288%22',
    name: 'Oat Milk'
  },{
    imgSrc: 'https://globalassets.starbucks.com/digitalassets/products/bev/Oleato_GoldenFoam_ColdBrew.jpg?impolicy=1by1_tight_288%22',
    name: 'Oat Milk'
  },{
    imgSrc: 'https://globalassets.starbucks.com/digitalassets/products/bev/Oleato_GoldenFoam_ColdBrew.jpg?impolicy=1by1_tight_288%22',
    name: 'Oat Milk'
  },{
    imgSrc: 'https://globalassets.starbucks.com/digitalassets/products/bev/Oleato_GoldenFoam_ColdBrew.jpg?impolicy=1by1_tight_288%22',
    name: 'Oat Milk'
  },{
    imgSrc: 'https://globalassets.starbucks.com/digitalassets/products/bev/Oleato_GoldenFoam_ColdBrew.jpg?impolicy=1by1_tight_288%22',
    name: 'Oat Milk'
  },
];


}
