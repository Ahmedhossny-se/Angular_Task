import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild , Injectable, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from 'src/app/Models/IProduct';
import { ProductsApiService } from 'src/app/Services/products-api.service';
import { MatPaginator, MatPaginatorModule, PageEvent ,MatPaginatorIntl } from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Subject} from 'rxjs';
import '@angular/localize/init';
import { FormsModule } from '@angular/forms';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Items per page:`;
  lastPageLabel = $localize`Last page`;

  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;
  }
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,MatPaginatorModule,MatTableModule,MatIconModule,MatFormFieldModule,FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [ProductsApiService, {provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class ProductsComponent implements OnInit, AfterViewInit,OnChanges {
  prdListOfCat:IProduct[]=[];
  columnsToDisplay = ['images','title','description','price','rating','tags','brand']
  selectedValue!:number;
  star!:number;
  rating:any;
  data:any;
  pageSize = 10;
  pageIndex = 0;
  length = 0;
  title:string = "";
  isLoading: boolean = true;
  loading = false;
  progress = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private prdService: ProductsApiService){ 
    //[pageSize] = "pageSize"
     //[length] = "data.data.length"
     //this.data = new MatTableDataSource<IProduct>([]);
  }
  ngOnChanges(changes: SimpleChanges): void {
  
  }
  ngAfterViewInit(): void {
    this.data.data.paginator = this.paginator; 
  }
  ngOnInit(): void {
    this.prdService.GetAllProducts().subscribe({
      next:(res:any) => {  
        this.prdListOfCat = res.products;   
        //this.data.data = this.prdListOfCat;  
        this.data =  new MatTableDataSource<IProduct>(res.products)
        this.data.paginator = this.paginator; 
        this.length = this.prdListOfCat.length;            
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
      complete: () => {
        this.loading = false;
        this.isLoading = false;
      }  
    })  
  }

  isSearching()
  {    
    this.loading = true;
    this.prdService.GetProductsByTitle(this.title).subscribe({
      next:(res:any) => {
        this.prdListOfCat = res.products;   
        //this.data.data = this.prdListOfCat;  
        this.data =  new MatTableDataSource<IProduct>(res.products)
        this.data.paginator = this.paginator; 
        this.length = this.prdListOfCat.length;  
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
      complete: () => {
        this.loading = false;
        this.isLoading = false;
      }  
    })     
  }
} 