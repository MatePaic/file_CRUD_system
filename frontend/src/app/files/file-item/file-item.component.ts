import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../core/components/confirmation-modal/confirmation-modal.component';
import { FilesizePipe } from '../../core/pipes/filesize.pipe';
import { FileStorageService } from '../../core/services/file-storage.service';

@Component({
  selector: 'app-file-item',
  standalone: true,
  imports: [CommonModule, FilesizePipe],
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent {
  @Input() file!: any;

  constructor(
    private fileService: FileStorageService,
    private modalService: NgbModal,
  ) {}

  downloadFile(): void {
    this.fileService.downloadFile(this.file.name).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  deleteFile(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.message = `Are you sure you want to delete ${this.file.name}?`;
    modalRef.result.then(() => {
      this.fileService.deleteFile(this.file.name).subscribe(() => {
        window.location.reload(); // Or emit event to parent
      });
    }).catch(() => {});
  }
}