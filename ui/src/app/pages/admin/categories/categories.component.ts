import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {
  constructor() {}

  categories: any = [];
  searchTerm = "";
  filteredCategories: any = [];

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categories = [
      {
        _id: '1',
        name: 'Drinks',
      },
      {
        _id: '2',
        name: 'Food',
      },
      {
        _id: '3',
        name: 'Merchandise',
      },
    ];

    this.filteredCategories = this.categories;
  }

  performSearch() {
    if (this.searchTerm) {
      const lowerCaseSearch = this.searchTerm.toLowerCase();
      this.filteredCategories = this.categories.filter((category: any) =>
        category.name.toLowerCase().includes(lowerCaseSearch)
      );
    } else {
      this.filteredCategories = this.categories;
    }
  }
}
