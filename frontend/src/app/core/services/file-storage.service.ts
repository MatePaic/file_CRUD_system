import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileStorageService {
  private baseUrl = 'http://localhost:5000/api/files';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.baseUrl, formData);
  }

  getFiles(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  deleteFile(fileName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${fileName}`);
  }

  downloadFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${fileName}`, { responseType: 'blob' });
  }
}