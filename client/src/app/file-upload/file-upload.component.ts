import { Component } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http'; // Import HttpClientModule here if used directly, but better via service
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf
import { FileManagementService } from '../services/file-management.service';

@Component({
  selector: 'app-file-upload',
  standalone: true, // Make this component standalone
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadMessage: string = '';

  constructor(private fileManagementService: FileManagementService) { }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadProgress = 0;
      this.uploadMessage = '';
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.fileManagementService.uploadFile(this.selectedFile).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total!);
          } else if (event instanceof HttpResponse) {
            this.uploadMessage = 'File uploaded successfully!';
            console.log(event.body);
            // You might want to notify the file list component to refresh
          }
        },
        error => {
          this.uploadMessage = 'File upload failed.';
          console.error('Error uploading file:', error);
          // Handle error
        }
      );
    } else {
      this.uploadMessage = 'Please select a file first.';
    }
  }
}