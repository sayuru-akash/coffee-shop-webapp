import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from 'src/app/webSocket.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent {
  messages: Observable<{ type: string; message: string }[]>;

  constructor(
    private http: HttpClient,
    private websocketService: WebsocketService
  ) {
    this.messages = this.websocketService.getMessages();
    console.log(this.messages);
  }

  pickupLocations = ['Location 1', 'Location 2', 'Location 3', 'Location 4'];
  selectedPickupLocation = '';
  cartItems: any = [];
  total = 0;
  loggedIn = false;
  loggedInUserId = '';

  ngOnInit(): void {
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

    if (this.loggedIn) {
      this.getCartItems();
    }
  }

  getCartItems() {
    try {
      this.http
        .get(`http://localhost:3000/api/cart/${this.loggedInUserId}`)
        .subscribe((response: any) => {
          const cart = response.cart;

          if (cart) {
            this.cartItems = cart.products.map((product: any) => ({
              id: product.productId,
              quantity: product.quantity,
              name: product.name,
              price: product.price,
              imgSrc: product.image.replace('/upload/', '/upload/w_200/'),
              category: product.category,
            }));

            this.total = this.cartItems.reduce(
              (total: number, item: any) => total + item.price * item.quantity,
              0
            );

            console.log('Cart items fetched successfully:', this.cartItems);
          }
        });
    } catch (error) {
      console.log('Error fetching cart items:', error);
    }
  }

  onSubmit() {
    if (!this.selectedPickupLocation || this.cartItems.length === 0) {
      console.log(
        'Please select a pickup location and add items to your cart.'
      );
      return;
    }

    const orderData = {
      userId: this.loggedInUserId,
      products: this.cartItems.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.imgSrc,
        category: item.category,
      })),
      total: this.total,
      pickupLocation: this.selectedPickupLocation,
      status: 'placed',
    };

    try {
      this.http
        .post('http://localhost:3000/api/order/add', orderData)
        .subscribe(
          (response) => {
            console.log('Order submitted successfully:', response);
            this.sendWebSocketMessage(
              'New order received from ' + this.loggedInUserId
            );

            this.cartItems = [];
            this.total = 0;
            confirm('Order submitted successfully. Thank you!') &&
              window.location.replace('/');
          },
          (error) => {
            console.error('Error submitting order:', error);
          }
        );
    } catch (error) {
      console.log('Error submitting order:', error);
    }
  }

  sendWebSocketMessage(message: string): void {
    this.websocketService.sendMessage(message);
  }
}
