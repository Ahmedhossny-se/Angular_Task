import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from "./Components/products/products.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table'
import { ProductsApiService } from './Services/products-api.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FooterComponent } from './Components/Footer/footer/footer.component';
import { HeaderComponent } from './Components/Header/header/header.component';
import { InterceptorService } from './Services/interceptor.service';
import { TokenInterceptorService } from './Services/token-interceptor.service';
import { MatSort, MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductsComponent,
    BrowserAnimationsModule,
    MatTableModule,
    MatChipsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatSortModule
],
  providers: [ProductsApiService
    ,{provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi: true},
    {provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
