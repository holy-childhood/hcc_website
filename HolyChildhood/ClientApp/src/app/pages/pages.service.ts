import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Page } from '../shared/models/page';
import { PageContent, TextContent } from '../shared/models/page-content';
import { NavService } from '../shared/services/nav.service';
import { TextContentBackup} from '../shared/models/page-content';

const http_options = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class PagesService {
    public page: Page;

    constructor(private http: HttpClient, private router: Router, private nav: NavService) { }

    public loadPage(id) {
        this.getPage(id).subscribe(page => this.page = page);
    }

    public reloadPage() {
        this.loadPage(this.page.id);
    }

    public addPage(page: Page) {
        const url = '/api/page';
        this.http.post<Page>(url, page, http_options).subscribe(res => {
            this.nav.loadMenu();
            this.router.navigate([`/pages/${res.id}`]).then();
        });
    }

    public getPage(id: number | string): Observable<Page> {
        const url = `/api/page/${id}`;
        return this.http.get<Page>(url);
    }

    public updatePage(page: Page) {
        const url = `/api/page/${page.id}`;
        this.http.put(url, page, http_options).subscribe(() => {
            this.nav.loadMenu();
            this.loadPage(page.id);
        });
    }

    public deletePage() {
        const url = `/api/page/${this.page.id}`;
        this.http.delete<Page>(url).subscribe(() => {
            this.nav.loadMenu();
            if (this.page.parent) {
                this.router.navigate([`/pages/${this.page.parent.id}`]).then();
            } else {
                this.router.navigate(['/home']).then();
            }
        });
    }

    public addPageContent(contentType) {
        const url = `/api/pagecontent`;
        const newContent = { contentType: contentType, page: this.page} as PageContent;
        this.http.post(url, newContent, http_options).subscribe(() => {
            this.reloadPage();
        });
    }

    public updatePageContent(pageContent: PageContent) {
        const url = `/api/pagecontent/${pageContent.id}`;
        return this.http.put(url, pageContent, http_options);
    }

    public getTextContent(id: number | string): Observable<TextContent> {
        const url = `/api/textContent/${id}`;
        return this.http.get<TextContent>(url, http_options);
    }

    public updateTextContent(textContent: TextContent) {
        const url = `/api/textContent/${textContent.id}`;
        return this.http.put(url, textContent, http_options);
    }

    public deletePageContent(id: number | string) {
        const url = `/api/pagecontent/${id}`;
        return this.http.delete(url);
    }

    public loadTextContentBackups(id: number | string): Observable<TextContentBackup[]> {
        const url = `/api/textcontentbackup/${id}`;
        return this.http.get<TextContentBackup[]>(url);
    }

    public restoreContent(id: number | string): Observable<TextContent> {
        const url = `/api/textcontentbackup/${id}`;
        return this.http.post<TextContent>(url, null, http_options);
    }

    public addTab(tab) {
        const url = '/api/tab';
        this.http.post(url, tab, http_options).subscribe(() => {
            this.reloadPage();
        });
    }

    public saveTab(tab) {
        const url = `/api/tab/${tab.id}`;
        this.http.put(url, tab, http_options).subscribe(() => {
            this.reloadPage();
        });
    }

    public deleteTab(tab) {
        const url = `/api/tab/${tab.id}`;
        this.http.delete(url, http_options).subscribe(() => {
            this.reloadPage();
        });
    }

}
