import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileStorageService } from '../../core/services/file-storage.service';
import { FileItemComponent } from '../file-item/file-item.component';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, FileItemComponent],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  isLoading = true;
  files: any[] | null = null;

  constructor(private fileService: FileStorageService) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.isLoading = true;
    this.fileService.getFiles().subscribe({
      next: (files) => {
        this.files = files;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}