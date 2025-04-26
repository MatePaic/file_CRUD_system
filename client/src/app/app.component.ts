import { Component } from '@angular/core';
import { FileListComponent } from './file-list/file-list.component'; // Import standalone component
import { FileUploadComponent } from './file-upload/file-upload.component'; // Import standalone component

@Component({
  selector: 'app-root',
  standalone: true, // AppComponent is standalone
  imports: [FileListComponent, FileUploadComponent], // Import standalone components here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'file-management-app';
}