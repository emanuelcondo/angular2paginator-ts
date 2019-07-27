# Angular 2 Paginator
A pagination module for Angular 2 applications.

## Installation 
```sh
npm install angular2paginator-ts --save
```

## Angular Version
This library is built to work with **Angular 6+**, and support ahead-of-time compilation.
If you need to support an earlier or pre-release version of Angular for now, please see the changelog for advice on which version to use.

## Usage

```TypeScript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Angular2Paginator } from 'angular2paginator-ts';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        Angular2Paginator
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ]
})

export class MyAppModule {}
```

```TypeScript
// app.component.ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-component',
    template: `
        <angular2paginator
            [length]="length"
            [currentPage]="currentPage"
            [pageSize]="pageSize"
            [pageSizeOptions]="pageSizeOptions"
            [maxPagesToShow]="maxSize"
            [autoHide]="true"
            [disabled]="searching"
            (page)="onPageChange($event)">
        </angular2paginator>
    `
})

export class AppComponent {
    length: number = 100;
    currentPage: number = 1;
    pageSize: number = 10;
    pageSizeOptions: number[] = [ 10, 25, 50, 100 ];
    maxSize: number = 4;
    searching: boolean = false;
    
    public onPageChange(event: any) {
        console.log(event);
    }
}
```

## API
* **`length`** [`number`] Total number of items.
* **`currentPage`** [`number`] Currently selected page.
* **`pageSize`** [`number`] Number of items per page. Default is `25`.
* **`pageSizeOptions`** [`number[]`] The set of provided page size options to display to the user.
* **`maxPagesToShow`** [`number`] Maximum number of pages visible for selection. Default is `5`.
* **`autoHide`** [`boolean`] Hides the whole paginator if there is only one page. Default is `false`.
* **`disabled`** [`boolean`] Disables the pagination controls. Default is `false`.
* **`circleButton`** [`boolean`] If set to `true`, the buttons will be displayed in the shape of circles. Default is `false`.
* **`page`** [`event handler`] Event emitted when the user changes the page or the number of items per page. The `$event` argument will be an object with the following properties:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**`length`**: [`number`]
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**`currentPage`**: [`number`]
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**`previousPage`**: [`number`]
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**`pageSize`**: [`number`]
* **`pageSizeOptionsLabel`** [`string`] The label displayed on the page size options. Default is `Items per page`.
* **`hidePageSizeOptionsLabel`** [`boolean`] Hides the label for the page size options. Default is `false`.
* **`previousPageLabel`** [`string`] The label displayed on the tooltip of the button on the "previous" page. Default is `Previous`.
* **`nextPageLabel`** [`string`] The label displayed on the tooltip of the button on the "next" page. Default is `Next`.
* **`firstPageLabel`** [`string`] The label displayed on the tooltip of the button on the "first" page. Default is `First`.
* **`lastPageLabel`** [`string`] The label displayed on the tooltip of the button on the "last" page. Default is `Last`.
* **`disableTooltip`** [`boolean`] Disables tooltips to show the labels on the control buttons. Default is `false`.

## Test 
```sh
npm run test
```