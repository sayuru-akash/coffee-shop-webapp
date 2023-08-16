import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styles: [],
})
export class EditProductComponent {
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

  ngOnInit() {
    // Populate form fields with the data received
    this.name = this.data.name;
    this.description = this.data.description;
    this.price = this.data.price;
    this.category = this.data.category;
    this.image = this.data.image;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit(formData: any) {
    // Modify the itemData object accordingly for update
    const itemData = {
      name: formData.name,
      description: formData.description,
      price: String(formData.price),
      category: formData.category,
      image: this.image,
    };

    // Send HTTP request to update the product
    const productId = this.data._id; // Assuming the product has an _id property
    this.http
      .put(`http://localhost:3000/api/product/update/${productId}`, itemData)
      .subscribe((response: any) => {
        console.log('Product updated successfully:', response);
        this.dialogRef.close();
      });
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
