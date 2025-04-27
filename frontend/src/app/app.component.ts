import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileListComponent } from './files/file-list/file-list.component';
import { FileUploadComponent } from './files/file-upload/file-upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent, 
    FileListComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}