import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AddProductComponent } from './add-product/add-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  constructor(public dialog: MatDialog, private http: HttpClient) {}

  products: any = [];
  currentPage = 1;
  perPage = 10;
  totalPages = 0;

  searchTerm = '';
  filteredProducts: any = [];

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http
      .get<{ products: any[]; total: number }>(
        `http://localhost:3000/api/products?page=${this.currentPage}&limit=${this.perPage}`
      )
      .subscribe((data) => {
        this.products = data.products;
        this.totalPages = Math.ceil(data.total / this.perPage);
        this.filteredProducts = [...this.products]; // Create a new array reference
        this.performSearch(); // Initial filtering
      });
  }

  performSearch() {
    if (this.searchTerm) {
      console.log('Searching for ', this.searchTerm);
      this.filteredProducts = this.products.filter((product: any) =>
        this.matchSearchText(product)
      );
    } else {
      this.filteredProducts = [...this.products]; // Reset to all products
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchProducts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProducts();
    }
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The popup dialog was closed');
      this.fetchProducts();
    });
  }

  editProduct(product: any): void {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '400px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The popup dialog was closed');
      this.fetchProducts();
    });
  }

  deleteProduct(product: any): void {
    const productId = product._id;
    confirm('Are you sure you want to delete this product?') &&
    this.http
      .delete(`http://localhost:3000/api/product/delete/${productId}`)
      .subscribe((response: any) => {
        console.log('Product deleted successfully:', response);
        this.fetchProducts();
      });
  }

  matchSearchText(product: any): boolean {
    const lowerCaseSearch = this.searchTerm.toLowerCase();
    return product.name.toLowerCase().includes(lowerCaseSearch);
  }
}
