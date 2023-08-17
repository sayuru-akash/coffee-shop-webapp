import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: Date;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  currentPage: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http
      .get<{ users: User[]; total: number }>(
        'http://localhost:3000/api/users',
        {
          params: {
            page: this.currentPage.toString(),
            limit: this.itemsPerPage.toString(),
          },
        }
      )
      .subscribe(
        (data) => {
          this.users = data.users;
          this.totalItems = data.total;
          console.log('Users fetched successfully:', this.users);
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.fetchUsers();
  }
}
