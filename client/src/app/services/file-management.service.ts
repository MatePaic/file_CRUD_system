import { Injectable } from '@angular/core';
// Import necessary modules, including HttpResponse for type checking in tap
import { HttpClient, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
// Import Observable, Subject, throwError
import { Observable, Subject, throwError } from 'rxjs';
// Import operators like tap and catchError
import { tap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FileManagementService {
  // Ensure this URL is correct and accessible by your Angular app
  private baseUrl = 'http://localhost:5000/api/files';

  // Subject to notify components when the file list might have changed
  private fileListUpdatedSource = new Subject<void>();

  // Public observable that components will subscribe to
  fileListUpdated$ = this.fileListUpdatedSource.asObservable();

  constructor(private http: HttpClient) { }

  // Method to trigger the notification
  notifyFileListUpdated(): void {
    console.log('Service: Notifying file list update.');
    this.fileListUpdatedSource.next();
  }

  // Get a list of files
  getFiles(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log('Service: Making GET request to:', url);
    return this.http.get<any[]>(url).pipe(
      tap(data => console.log('Service: Received data from GET:', data)),
      catchError(error => {
        console.error('Service: Error fetching files:', error);
        // Re-throw the error so the component can handle it
        return throwError(() => new Error(error.message || 'Error fetching files'));
      })
    );
  }

  // Upload a file
  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}`, formData, {
      reportProgress: true,
      responseType: 'json' // Assuming your backend returns JSON on upload success
    });

    return this.http.request(req).pipe(
      tap(event => {
        // Check if the event is an HTTP response and the status is successful (e.g., 2xx)
        if (event instanceof HttpResponse && event.status >= 200 && event.status < 300) {
          console.log('Service: Upload successful, notifying list update.');
          this.notifyFileListUpdated(); // <--- Trigger update notification
        }
      }),
      catchError(error => {
        console.error('Service: Error uploading file:', error);
        return throwError(() => new Error(error.message || 'Error uploading file'));
      })
    );
  }

  // Download a file (no list update needed here)
  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.baseUrl}/download/${fileName}`;
     console.log('Service: Making GET request to download:', url);
    return this.http.get(url, {
      responseType: 'blob' // Expecting binary data (the file)
    }).pipe(
      catchError(error => {
        console.error('Service: Error downloading file:', error);
        return throwError(() => new Error(error.message || 'Error downloading file'));
      })
    );
  }

  // Delete a file
  deleteFile(fileName: string): Observable<any> {
    const url = `${this.baseUrl}/${fileName}`;
    console.log('Service: Making DELETE request to:', url);
    return this.http.delete(url).pipe(
      tap(() => {
        console.log('Service: Delete successful, notifying list update.');
        this.notifyFileListUpdated(); // <--- Trigger update notification
      }),
       catchError(error => {
        console.error('Service: Error deleting file:', error);
        return throwError(() => new Error(error.message || 'Error deleting file'));
      })
    );
  }
}