import { Component, Input } from '@angular/core';

import {Tab, TabContent, TextContent} from '../../shared/models/page-content';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-content-tabs',
  templateUrl: './content-tabs.component.html',
  styleUrls: ['./content-tabs.component.css']
})
export class ContentTabsComponent {

    @Input() pageContentId: number;
    @Input() tabContent: TabContent;

    displayTabDialog: boolean;
    tab = {} as Tab;

    constructor(private authService: AuthService,
                private pagesService: PagesService,
                private confirmService: ConfirmationService) { }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    deleteContent() {
        const id = this.pageContentId;
        this.pagesService.deletePageContent(id).subscribe(() => {
            this.pagesService.reloadPage();
        });
    }

    beforeTabChange($event: NgbTabChangeEvent) {
        if ($event.nextId === 'addTab') {
            this.showTabDialog(null);
            $event.preventDefault();
        }
    }

    showTabDialog(tab) {
        this.tab = {} as Tab;
        if (tab) {
            this.tab = Object.assign({}, tab);
        }
        this.displayTabDialog = true;
    }

    updateTab() {
        this.displayTabDialog = false;
        if (this.tab.id) {
            this.pagesService.saveTab(this.tab);
        } else {
            this.tab.tabContentId = this.tabContent.id;
            this.tab.textContent = {} as TextContent;
            this.pagesService.addTab(this.tab);
        }
    }

    deleteTab(tab) {
        this.confirmService.confirm({
           message: `Are you sure you want to delete the ${tab.title} tab`,
           key: 'tabDelete',
           accept: () => {
               this.pagesService.deleteTab(tab);
           }
        });
    }

}
