import { Component, OnInit, Input } from '@angular/core';
import {PageComponent} from '../page/page.component';
import {FormContent, PageContent} from '../../shared/models/page-content';
import {AuthService} from '../../shared/services/auth.service';

@Component({
    selector: 'app-content-forms',
    templateUrl: './content-forms.component.html',
    styleUrls: ['./content-forms.component.css']
})
export class ContentFormsComponent implements OnInit {
    @Input() pageComponent: PageComponent;
    @Input() pageContent: PageContent;
    @Input() formContent: FormContent;

    formFields: string [] = [];

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
    }

    addField(name) {
        this.formFields.push(name);
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit() && (this.authService.isAdministrator() || this.authService.isEditor());
    }

}
