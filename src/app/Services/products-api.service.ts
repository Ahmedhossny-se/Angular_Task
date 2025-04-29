import { Injectable } from '@angular/core';
import { IProduct } from 'src/app/Models/IProduct';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { ApiResponce } from '../Models/ApiResponce';
import { Login } from '../Models/Login';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {

  //  APIURL:string =  'https://dummyjson.com/products?limit=0&skip=0&select=title,description,price,rating,tags,brand'
  APIURL:string =  'https://dummyjson.com/products'
  LoginUrl:string = 'https://dummyjson.com/auth/login'
  body = {
    username: 'emilys',
    password: 'emilyspass'
  };
  constructor(private httpClient: HttpClient) { }

  // GetAllProducts(): Observable<IProduct[]>
  // {
  //   return this.httpClient.get<IProduct[]>(`${this.APIURL}`).pipe(
  //     delay(100)
  //   );
  // }

  GetAllProducts(page:number = 1,limit: number = 10): Observable<IProduct[]>
  {
    let skip = (page - 1) * limit;
    //let url = `${this.APIURL}?limit=${limit}&skip=${skip}`
    let url = `${this.APIURL}?limit=${limit}&skip=${skip}&sortBy=price&order=asc`
    return this.httpClient.get<IProduct[]>(`${url}`).pipe(
      delay(100)
    );
  }

  GetProductsByTitle(title: string): Observable<ApiResponce>
  {
    return this.httpClient.get<ApiResponce>(this.APIURL+`/search?q=${title}`)
  }

  sortProducts(page:number = 1,limit: number = 10,sortBy:string = "price",order:string = "asc")
  {
    let url = `${this.APIURL}?limit=0&skip=20&sortBy=${sortBy}&order=${order}`
    return this.httpClient.get<IProduct[]>(`${url}`).pipe(
      delay(100)
    );
  }

  GetProductsByCatId(catId: number): Observable<IProduct[]>
  {
    return this.httpClient.get<IProduct[]>(`${this.APIURL}/products?categoryid=${catId}`);
  }

  Login()
  {
    return this.httpClient.post<Login[]>(`${this.LoginUrl}`,this.body);
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
