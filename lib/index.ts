import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';

interface PageEvent {
    length: number,
    currentPage: number;
    previousPage: number;
    pageSize: number;
}

const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_VISIBLE_PAGES = 5;
const DEFAULT_PAGE_SIZE_OPTIONS_LABEL = "Items per page";
const DEFAULT_PREVIOUS_PAGE_LABEL = "Previous";
const DEFAULT_NEXT_PAGE_LABEL = "Next";
const DEFAULT_FIRST_PAGE_LABEL = "First";
const DEFAULT_LAST_PAGE_LABEL = "Last";

@Component({
  selector: 'angular2paginator',
  template: `
    <div class="paginator-container" [ngClass]="{ 'hide': autoHide && pages.length < 2, 'disabled': disabled }">
        <div *ngIf="pageSizeOptions && pageSizeOptions.length" class="page-size-control">
            <div *ngIf="!hidePageSizeOptionsLabel" class="page-size-control-label">{{pageSizeOptionsLabel}}:</div>
            <div class="select-page-size">
                <div (click)="openPageSizeOptions()" class="text">{{pageSize}}</div>
                <span (click)="openPageSizeOptions()" [ngClass]="{ 'open': optionsOpened }" >
                    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg>
                </span>
                <div *ngIf="optionsOpened" class="select-page-size-options">
                    <ul>
                        <li *ngFor="let size of pageSizeOptions" (click)=onSizeChange(size) [ngClass]="{ 'selected': pageSize == size }">{{size}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="page-change-control"  [ngClass]="{ 'circle-button': circleButton, 'tooltip-enabled': !disableTooltip }">
            <button class="page-button" (click)="firstPage()" [disabled]="currentPage == 1 ">&#10094;&#10094;<div class="tooltip-text">{{firstPageLabel}}</div></button>
            <button class="page-button" (click)="previousPage()" [disabled]="currentPage == 1 ">&#10094;<div class="tooltip-text">{{previousPageLabel}}</div></button>

            <button class="page-button" *ngIf="pagesOnTheLeft" (click)="loadPagesFromTheLeft()">...</button>
            <button class="page-button" *ngFor="let page of visiblePages" [ngClass]="{ 'selected': currentPage == page }" (click)="onPageChange(page)">{{page}}</button>
            <button class="page-button" *ngIf="pagesOnTheRight" (click)="loadPagesFromTheRight()">...</button>

            <button class="page-button" (click)="nextPage()" [disabled]="!pages.length || currentPage == pages.length">&#10095;<div class="tooltip-text">{{nextPageLabel}}</div></button>
            <button class="page-button" (click)="lastPage()" [disabled]="!pages.length || currentPage == pages.length">&#10095;&#10095;<div class="tooltip-text">{{lastPageLabel}}</div></button>
        </div>
    </div>
  `,
  styles: [`
    .paginator-container {
        display: flex;
        float: left;
        color: rgba(0,0,0,.54);
        font-family: sans-serif;
        font-size: 14px;
    }

    .paginator-container.disabled {
        pointer-events: none;
        opacity: 0.5;
    }

    .paginator-container.hide {
        display: none;
    }

    .page-size-control {
        display: flex;
    }

    .page-size-control-label {
        margin: auto 10px auto 0;
    }

    .select-page-size {
        margin-right: 40px;
        position: relative;
        float: left;
        width: 65px;
        height: 40px;
        background-color: #fff;
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
        border-radius: 3px;
        transition: all 375ms ease-in-out;
        cursor: pointer;
    }

    .select-page-size .text {
        margin-top: 12px;
        margin-left: 15px;
    }

    .select-page-size span {
        position: absolute;
        top: 10px;
        right: 5%;
        font-size: 16px;
        height: 22px;
        transition: all 275ms;
        transform: rotate(0deg);
    }

    .select-page-size span.open {
        transform: rotate(180deg);
    }

    .select-page-size-options ul {
        position: absolute;
        left: 0px;
        top: -100%;
        z-index: 999;
        max-height: 136px;
        overflow-y: auto;
        width: 100%;
        background-color: #fff;
        padding: 0px;
        margin-bottom: 0px;
        margin-top: 0px;
        border-radius: 4px;
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
        transition: all 375ms ease-in-out;
    }

    .select-page-size-options ul li {
        position: relative;
        float: left;
        width: 100%;
        background-color: #fff;
        list-style-type: none;
        padding: 8px 0;
        margin: 0px;
        transition: all 275ms ease-in-out;
        display: block;
        cursor: pointer;
        text-align: center;
    }

    ul li:first-child {
        border-radius: 4px 4px 0 0;
    }

    ul li:last-child {
        border-radius: 0 0 4px 4px;
    }

    .select-page-size-options ul li:hover, .select-page-size-options ul li.selected {
        background-color: #EEEEEE;
    }

    .page-change-control {
        display: flex;
    }

    .page-button {
        position: relative;
        padding: 0;
        min-width: 0;
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        line-height: 40px;
        border-radius: 4px;
        outline: none;
        border-color: transparent;
        font-size: 14px;
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
        margin-right: 8px;
    }

    .tooltip-text {
        visibility: hidden;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        top: -35px;
        left: -50%;
        width: 70px;
        height: 20px;
        font-size: 12px;
        padding: 5px;
        background-color: rgb(66, 65, 65);
        color: #fff;
        border-radius: 6px;
        z-index: 1;
    }

    .tooltip-enabled button.page-button:hover:not([disabled]) .tooltip-text {
        visibility: visible;
    }

    .page-change-control.circle-button .page-button {
        border-radius: 50%;
    }

    .page-button:hover:not([disabled]), .page-button.selected:not([disabled]) {
        background-color: rgba(0,0,0,.25);
        cursor: pointer;
    }

    .page-change-control button.page-button:last-child {
        margin-right: 0;
    }
  `]
})

export class Angular2Paginator implements OnInit {
    @Input() length: number;
    @Input() currentPage: number;
    @Input() pageSize: number;
    @Input() pageSizeOptions: number[];
    @Input() maxPagesToShow: number;
    @Input() circleButton: boolean;
    @Input() autoHide: boolean;
    @Input() disabled: boolean;
    @Input() hidePageSizeOptionsLabel: boolean;
    @Input() disableTooltip: boolean;
    @Input() pageSizeOptionsLabel: string;
    @Input() previousPageLabel: string;
    @Input() nextPageLabel: string;
    @Input() firstPageLabel: string;
    @Input() lastPageLabel: string;

    @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

    pages: number[];
    visiblePages: number[];
    pagesOnTheLeft: boolean;
    pagesOnTheRight: boolean;
    optionsOpened: boolean = false;

    ngOnInit() {
        this.initialize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['length']) {
            this.initialize();
        }
    }

    private initialize() {
        this.pages = [];
        this.visiblePages = [];
        this.length = (this.length > 0) ? Math.ceil(this.length) : 0;
        this.currentPage = (this.currentPage && this.currentPage > 0) ? Math.ceil(this.currentPage) : 1;
        this.pageSize = (this.pageSize && this.pageSize > 0) ? Math.ceil(this.pageSize) : DEFAULT_PAGE_SIZE;
        this.pageSizeOptions = this.pageSizeOptions ? (this.pageSizeOptions.filter((size) => { return size > 0; })) : [];
        this.pageSizeOptions = this.pageSizeOptions.map((size) => { return Math.ceil(size); });
        let number_pages = Math.ceil(this.length / this.pageSize);
        this.maxPagesToShow = (this.maxPagesToShow) ? Math.abs(this.maxPagesToShow) : DEFAULT_VISIBLE_PAGES;

        for (let i = 1; i <= number_pages; i++) {
            this.pages.push(i);
        }

        let _start = this.currentPage - this.maxPagesToShow;
        _start = _start > 0 ? _start : 0;
        let _end = _start + this.maxPagesToShow;
        this.visiblePages = this.pages.slice(_start, _end);
        this.pagesOnTheLeft = (this.pages.length && !this.visiblePages.includes(1));
        this.pagesOnTheRight = (this.pages.length && !this.visiblePages.includes(this.pages.length));

        this.pageSizeOptionsLabel = (this.pageSizeOptionsLabel && this.pageSizeOptionsLabel.trim()) ? this.pageSizeOptionsLabel.trim() : DEFAULT_PAGE_SIZE_OPTIONS_LABEL;
        this.previousPageLabel = (this.previousPageLabel && this.previousPageLabel.trim()) ? this.previousPageLabel.trim() : DEFAULT_PREVIOUS_PAGE_LABEL;
        this.nextPageLabel = (this.nextPageLabel && this.nextPageLabel.trim()) ? this.nextPageLabel.trim() : DEFAULT_NEXT_PAGE_LABEL;
        this.firstPageLabel = (this.firstPageLabel && this.firstPageLabel.trim()) ? this.firstPageLabel.trim() : DEFAULT_FIRST_PAGE_LABEL;
        this.lastPageLabel = (this.lastPageLabel && this.lastPageLabel.trim()) ? this.lastPageLabel.trim() : DEFAULT_LAST_PAGE_LABEL;
    }

    public firstPage() {
        if (!this.visiblePages.includes(1)) {
            this._loadVisiblePages(0, this.maxPagesToShow);
        }
        this.onPageChange(1);
    }

    public previousPage() {
        if (this.currentPage > 1) {
            let prev_page = this.currentPage - 1;
            if (!this.visiblePages.includes(prev_page)) {
                let start = prev_page - 1;
                let end = start + this.maxPagesToShow;
                this._loadVisiblePages(start, end);
            }
            this.onPageChange(prev_page);
        }
    }

    public nextPage() {
        if (this.currentPage < this.pages.length) {
            let next_page = this.currentPage + 1;
            if (!this.visiblePages.includes(next_page)) {
                let start = next_page - this.maxPagesToShow;
                start = start > 0 ? start : 0;
                let end = next_page;
                this._loadVisiblePages(start, end);
            }
            this.onPageChange(this.currentPage + 1);
        }
    }

    public lastPage() {
        let last_page = this.pages.length;
        if (!this.visiblePages.includes(last_page)) {
            this._loadVisiblePages(-this.maxPagesToShow);
        }
        this.onPageChange(this.pages.length);
    }

    public onPageChange(page: number) {
        this.optionsOpened = false;
        let data = {
            length: this.length,
            currentPage: page,
            previousPage: this.currentPage,
            pageSize: this.pageSize
        };
        this.currentPage = page;
        this.page.emit(data);
    }

    public onSizeChange(size: number) {
        this.optionsOpened = false;
        if (this.pageSize != size) {
            let new_max_page = Math.ceil(this.length / size);
            if (new_max_page < this.currentPage) {
                this.currentPage = new_max_page;
            }
            this.pageSize = size;
            this.initialize();
            this.onPageChange(this.currentPage);
        }
    }

    public openPageSizeOptions() {
        this.optionsOpened = true;
    }

    private _loadVisiblePages(start: number, end?: number) {
        this.visiblePages = this.pages.slice(start, end);
        let last_page = this.pages.length;
        this.pagesOnTheLeft = (this.pages.length && !this.visiblePages.includes(1));
        this.pagesOnTheRight = (this.pages.length && !this.visiblePages.includes(last_page));
    }

    public loadPagesFromTheLeft() {
        let first_visible = this.visiblePages[0];
        let new_first_visible = first_visible - this.maxPagesToShow;
        new_first_visible = new_first_visible > 0 ? new_first_visible : 1;
        let start = new_first_visible - 1;
        let end = start + this.maxPagesToShow;
        this._loadVisiblePages(start, end);
        let new_page = first_visible - 1;
        this.onPageChange(new_page);
    }

    public loadPagesFromTheRight() {
        let last_visible = this.visiblePages[this.visiblePages.length - 1];
        let last_page = this.pages.length;
        let start = last_visible;
        if (start + this.maxPagesToShow > last_page) {
            start = last_page - this.maxPagesToShow;
            start = start > 0 ? start : 0;
        }
        let end = start + this.maxPagesToShow;
        this._loadVisiblePages(start, end);
        let new_page = last_visible + 1;
        this.onPageChange(new_page);
    }
}
