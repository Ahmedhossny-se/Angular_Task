import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor() { 
    
  }
  beginLoad()
  {
    this.isLoading.next(true);
    console.log(this.isLoading);
  }
  endLoad()
  {
    this.isLoading.next(false);
  }
}
