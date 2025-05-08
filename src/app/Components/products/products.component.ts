import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild , Injectable, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from 'src/app/Models/IProduct';
import { ProductsApiService } from 'src/app/Services/products-api.service';
import { MatPaginator, MatPaginatorModule, PageEvent ,MatPaginatorIntl } from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Subject} from 'rxjs';
import '@angular/localize/init';
import { FormsModule } from '@angular/forms';
import { LoaderService } from 'src/app/Services/loader.service';
import {DatePipe} from '@angular/common';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {merge, Observable, of as observableOf} from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  constructor(private prdObj: ProductsComponent){}
  changes = new Subject<void>();
  pageIndex:number = 0;
  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Items per page:`;
  lastPageLabel = $localize`Last page`;

  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';
  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 of 1`;
    }
    // this.prdObj.pageNo = page;
    // this.prdObj.pageSize = pageSize;
    // if(page > this.pageIndex && this.prdObj.searchLoading )
    // {
    //   console.log(page,this.pageIndex);
    //   this.prdObj.test1 = 15;
    //   this.prdObj.changePage(0,20);
    //   this.pageIndex++;
    // }    
    // if(page < this.pageIndex)
    // {
    //   this.pageIndex = page -1;
    // }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;    
  }   
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,MatPaginatorModule,MatTableModule,MatIconModule,MatFormFieldModule,FormsModule,MatSortModule,RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [ProductsApiService, {provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class ProductsComponent implements OnInit, AfterViewInit,OnChanges {
  prdListOfCat:IProduct[]=[];
  columnsToDisplay = ['images','title','description','price','rating','tags','brand','actions']
  data:any;
  length = 0;
  title:string = "";
  searchLoading: boolean = false;
  loading = false;
  progress = 0;
  test1=0;
  pageNo=0;
  pageSize=5;
  totalItems:number;
  pageEvent: PageEvent;
  issorting:boolean = false;
  token:string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public prdService: ProductsApiService,public loaderService: LoaderService,route: Router){ 
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngAfterViewInit(): void {
    console.log(this.sort.active);
  }
  ngOnInit(): void {
    this.getAllProducts();
    this.prdService.Login().subscribe({
      next:(res:any) => {  
        this.token = res.accessToken;
        console.log(this.token);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
      complete: () => {      
      }  
    });
  }
  
  getAllProducts()
  {
    this.loading = true;
    this.prdService.GetAllProducts().subscribe({
      next:(res:any) => {  
        this.prdListOfCat = res.products;    
        this.data =  new MatTableDataSource<IProduct>(res.products)
        this.data.paginator = this.paginator; 
        this.length = this.prdListOfCat.length;
        this.loaderService.beginLoad();
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
      complete: () => {
        this.loading = false;
        this.searchLoading = false;
        this.loaderService.endLoad();
      }  
    })
  }

  isSearching()
  {    
    this.loading = true;
    this.searchLoading = true;
    this.prdService.GetProductsByTitle(this.title).subscribe({
      next:(res:any) => {
        this.prdListOfCat = res.products;   
        this.data =  new MatTableDataSource<IProduct>(res.products)
        this.data.paginator = this.paginator; 
        this.length = this.prdListOfCat.length;  
        this.loaderService.beginLoad();
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
      complete: () => {
        this.loading = false;
        this.searchLoading = false;
        this.loaderService.endLoad();
      }  
    })     
  }

  changePage(page:number,limit:number)
  {
    this.loading = true;
    this.prdService.GetAllProducts(page,limit).subscribe({
      next:(res:any) => {  
        this.prdListOfCat = res.products;   
        this.data = this.prdListOfCat;     
        this.length = this.prdListOfCat.length;
        this.totalItems = res.total;    
        console.log(this.totalItems);  
        this.loaderService.beginLoad();        
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
      complete: () => {
        this.loading = false;
        this.loaderService.endLoad();     
        if (this.paginator) {
          this.paginator.length = this.totalItems;
          this.paginator.pageIndex = page;
          console.log(page);          
        }  
      }  
    })
  }

  sortProducts(sort: Sort):void
  {    
    this.issorting = true;
    this.prdService.sortProducts(this.pageNo,this.pageSize,this.sort.active,this.sort.direction).subscribe({
      next:(res:any) => {  
        this.prdListOfCat = res.products; 
        this.data =  new MatTableDataSource<IProduct>(res.products)
        this.data.paginator = this.paginator; 
        this.length = this.prdListOfCat.length;
        this.loaderService.beginLoad();
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
      complete: () => {
        this.loading = false;
        this.searchLoading = false;
        this.loaderService.endLoad();
      } 
    })
  }

  setPage(event)
  {
    if(!this.issorting || this.searchLoading)
      this.changePage(event.pageIndex,event.pageSize);

    console.log(event.pageIndex)
  }
} 