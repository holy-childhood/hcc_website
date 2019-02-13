import {Page} from './page';
import {Calendar} from './calendar';

export interface PageContent {
    id: number;
    contentType: string;
    hasTitle: boolean;
    title: string;
    editing: boolean;
    index: number;
    pageId: number;
    page: Page;
    textContent: TextContent;
    tabContent: TabContent;
    calendarContent: CalendarContent;
}

export interface TextContent {
    id: number;
    content: string;
}

export interface TabContent {
    id: number;
    tabs: Tab[];
}

export interface Tab {
    id: number;
    title: string;
    index: number;
    tabContentId: number;
    textContent: TextContent;
}

export interface CalendarContent {
    id: number;
    calendarId: number;
    calendar: Calendar;
}

export interface TextContentBackup {
    id: number;
    creationDate: Date;
    displayDate: string;
    content: string;
    textContentId: number;
    textContent: TextContent;
}
