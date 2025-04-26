import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
import { FileManagementService } from '../services/file-management.service'; // Ensure this path is correct
import { CommonModule } from '@angular/common'; // Needed for *ngIf and *ngFor if not using @if/@for
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [
    CommonModule // Include CommonModule if using *ngIf, *ngFor. Remove if using @if, @for.
  ],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit, OnDestroy { // Implement OnDestroy
  files: any[] = [];
  private fileListSubscription: Subscription | undefined; // To hold the subscription

  constructor(private fileManagementService: FileManagementService) { }

  ngOnInit(): void {
    console.log('FileListComponent ngOnInit: Loading initial files.');
    this.loadFiles();

    // Subscribe to the fileListUpdated$ observable from the service
    // When the service calls notifyFileListUpdated(), this function will execute.
    this.fileListSubscription = this.fileManagementService.fileListUpdated$.subscribe(() => {
      console.log('FileListComponent: Received notification to update list. Reloading files...');
      this.loadFiles(); // <--- Reload files when the service notifies
    });
  }

  ngOnDestroy(): void {
    console.log('FileListComponent ngOnDestroy: Unsubscribing.');
    // Important: Unsubscribe when the component is destroyed to prevent memory leaks
    if (this.fileListSubscription) {
      this.fileListSubscription.unsubscribe();
    }
  }

  loadFiles(): void {
    console.log('FileListComponent: Executing loadFiles()...');
    this.fileManagementService.getFiles().subscribe(
      data => {
        console.log('FileListComponent: Data received from getFiles():', data);
        this.files = data;
      },
      error => {
        console.error('FileListComponent: Error loading files:', error);
        // Handle error (e.g., display a user-friendly message)
        this.files = []; // Clear the list or show an error state
      }
    );
  }

  downloadFile(fileName: string): void {
    console.log('FileListComponent: Download requested for:', fileName);
    this.fileManagementService.downloadFile(fileName).subscribe(
      blob => {
        // Logic to create and click the download link
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
        console.log('FileListComponent: Download initiated for:', fileName);
      },
      error => {
        console.error('FileListComponent: Error downloading file:', error);
        // Handle error
      }
    );
  }

  deleteFile(fileName: string): void {
     console.log('FileListComponent: Delete requested for:', fileName);
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      this.fileManagementService.deleteFile(fileName).subscribe(
        () => {
          console.log('FileListComponent: Delete request successful.');
          // No need to call this.loadFiles() here directly.
          // The service's tap operator already called notifyFileListUpdated(),
          // which triggers the subscription in ngOnInit, leading to loadFiles().
        },
        error => {
          console.error('FileListComponent: Error deleting file:', error);
          // Handle error
        }
      );
    }
  }
}