import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
})
export class ProductSingleComponent {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  productId: string = '';
  product: any = {};

  selectedSize: string = '';
  selectedCoffeeFlavor: string = '';
  selectedSweetnessLevel: string = '';
  selectedQuantity: number = 1;
  loggedIn: boolean = false;
  loggedInUserId: string = '';

  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.fetchProduct();
    });

    const loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      const now = new Date();
      const item = JSON.parse(loginToken);
      if (now.getTime() < item.expiration) {
        this.loggedIn = true;
        this.loggedInUserId = item.id;
        console.log('Logged in user ID:', this.loggedInUserId);
      }
    }
  }

  fetchProduct() {
    this.http
      .get(`http://localhost:3000/api/product/${this.productId}`)
      .subscribe((product) => {
        this.product = product;
        console.log('Product fetched successfully:', this.product);
      });
  }

  coffeeFlavors = [
    { value: 'caramel', label: 'Caramel' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'hazelnut', label: 'Hazelnut' },
    { value: 'mocha', label: 'Mocha' },
    { value: 'irish-cream', label: 'Irish Cream' },
  ];

  sweetnessLevels = [
    { value: 'none', label: 'None' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  onSubmit(form: NgForm) {
    if (!this.loggedIn) {
      // If not logged in, redirect to the login page
      window.location.href = '/login'; 
      return;
    }

    const cartData = {
      userId: this.loggedInUserId,
      productId: this.productId,
      name: this.product.product.name,
      price: this.product.product.price,
      category: this.product.product.category,
      image: this.product.product.image,
      quantity: this.selectedQuantity,
    };

    this.http.post('http://localhost:3000/api/cart/add', cartData).subscribe(
      (response) => {
        console.log('Product added to cart:', response);
        this.successMessage = 'Product added to cart successfully!';
        this.errorMessage = ''; // Clear any previous error messages
      },
      (error) => {
        console.error('Error adding product to cart:', error);
        this.errorMessage = 'Error adding product to cart. Please try again.';
        this.successMessage = ''; // Clear any previous success messages
      }
    );
  }
}
