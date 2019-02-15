import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { FileContent } from '../../shared/models/page-content';
import { Pdf } from '../../shared/models/file';
import { AuthService } from '../../shared/services/auth.service';
import { PagesService } from '../pages.service';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'app-content-files',
  templateUrl: './content-files.component.html',
  styleUrls: ['./content-files.component.css']
})
export class ContentFilesComponent implements OnInit {

    @Input() pageComponent: PageComponent;
    @Input() pageContentId: number;
    @Input() fileContent: FileContent;

    @ViewChild('uploadDialog') uploadDialog: ElementRef;
    modalRef: BsModalRef;

    public currentPdf: String;
    bulletins: Pdf[];
    selectedBulletin: Pdf;

    uploadFiles: File[];
    uploadFileName: string;

    constructor(private authService: AuthService,
                private pagesService: PagesService,
                private modalService: BsModalService,
                private http: HttpClient) { }

    ngOnInit() {
        if (this.isEditOn()) {
            this.loadBulletins();
        }
    }

    loadBulletins() {
        this.http.get<Pdf[]>('/api/file').subscribe(bulletins => {
            this.bulletins = bulletins
            if (bulletins.length > 0) {
                this.bulletins[0].title = 'Current Week';
                this.selectedBulletin = this.bulletins[0];
                this.currentPdf = `/files/${this.selectedBulletin.id}.pdf`;
            }
        });
    }

    loadBulletin() {
        this.currentPdf = `http://localhost:57084/files/${this.selectedBulletin.id}.pdf`;
    }

    showDialog(dialog) {
        this.modalRef = this.modalService.show(dialog);
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    showUploadFileDialog() {
        this.showDialog(this.uploadDialog);
    }

    fileSelectionChanged(uploadFiles: File[]) {
        console.log(uploadFiles);
        this.uploadFiles = uploadFiles;
    }

    uploadFile() {
        console.log(this.uploadFiles);
        console.log(this.uploadFileName);
        const formData = new FormData();
        Array.from(this.uploadFiles).forEach(f => formData.append('files', f));
        formData.append('name', this.uploadFileName);
        formData.append('fileContentId', this.fileContent.id.toString());
        this.http.post('/api/File', formData).subscribe();
    }

    deleteContent() {
        const id = this.pageContentId;
        this.pagesService.deletePageContent(id).subscribe(() => {
            this.pageComponent.loadPage();
        });
    }

}
