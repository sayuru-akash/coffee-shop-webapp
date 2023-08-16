import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styles: [],
})
export class AddProductComponent {
  constructor(
    private dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  name = '';
  description = '';
  price = '';
  category = '';
  itemImage: File | undefined;
  image = '';
  successMessage = '';
  errorMessage = '';

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit(formData: any) {
    const itemData = {
      name: formData.name,
      description: formData.description,
      price: String(formData.price),
      category: formData.category,
      image: this.image,
    };

    this.http.post('http://localhost:3000/api/product/add', itemData).subscribe(
      (response: any) => {
        this.successMessage = response.msg; // Set the success message
        this.errorMessage = ''; // Clear any previous error message
        this.dialogRef.close();
      },
      (error) => {
        this.errorMessage = error.error.msg || 'An error occurred'; // Set the error message
        this.successMessage = ''; // Clear any previous success message
      }
    );
  }

  handleImageUpload(event: any) {
    const imageFile = event.target.files[0] as File;

    if (imageFile) {
      if (imageFile.size <= 10485760) {
        this.uploadImage(imageFile).subscribe((response: any) => {
          const imageUrl = response.imageUrl;
          console.log('Uploaded image URL:', imageUrl);
          this.image = imageUrl;
        });
      } else {
        alert('Image size must be less than 10MB');
      }
    }
  }

  uploadImage(imageFile: File) {
    const formData = new FormData();
    formData.append('itemImage', imageFile);

    return this.http.post('http://localhost:3000/api/upload', formData);
  }
}
