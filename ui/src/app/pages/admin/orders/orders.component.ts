import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Order {
  _id: string;
  user: string;
  pickupLocation: string;
  total: number;
  createdAt: Date;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  currentPage: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.http
      .get<{ orders: Order[]; total: number }>('http://localhost:3000/api/orders', {
        params: {
          page: this.currentPage.toString(),
          limit: this.itemsPerPage.toString(),
        },
      })
      .subscribe(
        (data) => {
          this.orders = data.orders;
          this.totalItems = data.total;
          console.log('Orders fetched successfully:', this.orders);
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.fetchOrders();
  }
}
