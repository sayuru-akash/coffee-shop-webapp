import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  constructor(private http: HttpClient) {}

  categories: any = [];
  drinks: any = [];
  foods: any = [];
  merchandise: any = [];

  ngOnInit(): void {
    this.getCategories();
    this.getItems(this.categories.map((category: any) => category.name));
  }

  getCategories() {
    this.categories = [
      {
        name: 'Drinks',
        subcategories: [
          'Hot Coffees',
          'Hot Teas',
          'Cold Coffees',
          'Iced Teas',
          'Cold Drinks',
        ],
      },
      {
        name: 'Food',
        subcategories: ['Hot Breakfast', 'Bakery', 'Snacks & Sweets'],
      },
      {
        name: 'Merchandise',
        subcategories: ['Cold Cups', 'Mugs', 'Other'],
      },
    ];
  }

  getItems(categories: []) {
    for (const category of categories) {
      try {
        const apiUrl = `http://localhost:3000/api/products/${category}`;

        if (category === 'Drinks') {
          this.http.get(apiUrl).subscribe((response: any) => {
            this.drinks = response.products.map((product: any) => ({
              id: product._id,
              imgSrc: product.image.replace('/upload/', '/upload/w_200/'),
              name: product.name,
            }));
          });
        } else if (category === 'Food') {
          this.http.get(apiUrl).subscribe((response: any) => {
            this.foods = response.products.map((product: any) => ({
              id: product._id,
              imgSrc: product.image.replace('/upload/', '/upload/w_200/'),
              name: product.name,
            }));
          });
        } else if (category === 'Merchandise') {
          this.http.get(apiUrl).subscribe((response: any) => {
            this.merchandise = response.products.map((product: any) => ({
              id: product._id,
              imgSrc: product.image.replace('/upload/', '/upload/w_200/'),
              name: product.name,
            }));
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
