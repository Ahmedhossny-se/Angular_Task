import { Injectable } from '@angular/core';
import { IProduct } from 'src/app/Models/IProduct';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {

  //  APIURL:string =  'https://dummyjson.com/products?limit=0&skip=0&select=title,description,price,rating,tags,brand'
  APIURL:string =  'https://dummyjson.com/products'
  constructor(private httpClient: HttpClient) { }

  GetAllProducts(): Observable<IProduct[]>
  {
    return this.httpClient.get<IProduct[]>(`${this.APIURL}`);
  }

  GetProductsByCatId(catId: number): Observable<IProduct[]>
  {
    return this.httpClient.get<IProduct[]>(`${this.APIURL}/products?categoryid=${catId}`);
  }

  GetProductsByTitle(title: string): Observable<IProduct>
  {
    return this.httpClient.get<IProduct>(this.APIURL+`/search?q=${title}`)
  }

  AddProduct(newprd: IProduct)
  {
  }

  updateProduct(prdId: number, updatePrd:IProduct)
  {
    
  }

  deleteProduct(prdId: number)
  {
    
  }

}
