import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileStorageService } from '../../core/services/file-storage.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() uploaded = new EventEmitter<void>();
  selectedFile?: File;

  constructor(
    private fileService: FileStorageService,
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile).subscribe(() => {
        this.uploaded.emit();
        this.selectedFile = undefined;
      });
    }
  }
}