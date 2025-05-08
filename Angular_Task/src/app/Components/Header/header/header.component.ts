import { Component, Input, ViewChild } from '@angular/core';
import { every } from 'rxjs';
import { ProductsComponent } from 'src/app/Components/products/products.component';
import { ProductsApiService } from 'src/app/Services/products-api.service';
import { IProduct } from 'src/app/Models/IProduct';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import { MatPaginator, MatPaginatorModule, PageEvent ,MatPaginatorIntl } from '@angular/material/paginator';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers:[ProductsApiService],
})
export class HeaderComponent {
  title:string = "";
  prdListOfCat:IProduct[]=[];
  data:any;
  length = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor() {
   }
  //  isSearchings()
  //    {
  //      this.prdService.isSearching(this.title);
  //    }
}
