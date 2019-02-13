import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { Page } from '../../shared/models/page';
import {CalendarContent, FileContent, PageContent, TabContent, TextContent} from '../../shared/models/page-content';
import {NavService} from '../../shared/services/nav.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

    displayEditPageDialog = false;
    displayAddSubPageDialog = false;

    pageId: string | number;
    page: Page;

    pageEdit = {} as Page;
    pageAdd = {} as Page;

    constructor(private authService: AuthService,
                public pagesService: PagesService,
                private confirmService: ConfirmationService,
                private route: ActivatedRoute,
                private router: Router,
                private nav: NavService) {}

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.pageId = params.get('id');
            this.loadPage();
        });
    }

    loadPage() {
        this.pagesService.getPage(this.pageId).subscribe(page => this.page = page);
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    deletePage() {
        this.confirmService.confirm({
            message: 'Are you sure you want to delete this page?',
            key: 'pageDelete',
            accept: () => {
                this.pagesService.deletePage(this.pageId).subscribe(() => {
                    this.nav.loadMenu();
                    if (this.page.parent) {
                        this.router.navigate([`/pages/${this.page.parent.id}`]).then();
                    } else {
                        this.router.navigate(['/home']).then();
                    }
                });
            }
        });
    }

    addContent(contentType) {
        const content = {} as PageContent;
        content.contentType = contentType;
        content.page = this.page;
        if (contentType === 'Text') {
            content.textContent = {} as TextContent;
        } else if (contentType === 'Tabs') {
            content.tabContent = {} as TabContent;
        } else if (contentType === 'Files') {
            content.fileContent = {} as FileContent;
        } else if (contentType === 'Calendar') {
            // @TODO Replace calendarId with specified id
            content.calendarContent = { calendarId: 1 } as CalendarContent;
        }
        this.pagesService.addPageContent(content).subscribe(() => {
            this.loadPage();
        });
    }

    editPage() {
        this.pageEdit = Object.assign({}, this.page);
        this.displayEditPageDialog = true;
    }

    updatePage() {
        this.pagesService.updatePage(this.pageEdit).subscribe(() => {
            this.nav.loadMenu();
            this.loadPage();
        });
        this.displayEditPageDialog = false;
    }

    showAddSubPageDialog() {
        this.pageAdd = {} as Page;
        this.pageAdd.parent = this.page;
        this.displayAddSubPageDialog = true;
    }

    addSubPage() {
        this.displayAddSubPageDialog = false;
        this.pagesService.addPage(this.pageAdd).subscribe(res => {
            this.nav.loadMenu();
            this.router.navigate([`/pages/${res.id}`]).then();
        });
    }

}
