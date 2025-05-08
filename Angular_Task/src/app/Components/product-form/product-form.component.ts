// product-form.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IProduct } from 'src/app/Models/IProduct';
import { ProductsApiService } from 'src/app/Services/products-api.service';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  private destroy$ = new Subject<void>();
  imagePreviews: { url: string, file: File }[] = [];
  CurrProductId: number;
  editProduct: boolean = false;
  prd: Observable<IProduct[]>;
  product:IProduct;
  title:string ;
  constructor(private fb: FormBuilder,private prdservice: ProductsApiService,private activatedRoute: ActivatedRoute,private router: Router) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paraMap)=> 
      {
        this.CurrProductId = Number(paraMap.get('pid'));
        console.log(this.CurrProductId);
        if(this.CurrProductId)
          this.prd = this.prdservice.GetProductById(this.CurrProductId);         
      });
      if(this.prd)
        {
          this.prd.subscribe({
            next:(res:any) => {  
              this.product = res;
              this.product.title = res.title
              this.editProduct = true
              while (this.tags.length) {
                this.tags.removeAt(0);
              }
              
              if (res.tags && res.tags.length) {
                res.tags.forEach((tag: string) => {
                  this.addTag(tag);
                });            
              }
              this.imagePreviews = [{
                url: this.product.images[0],
                file: null
              }];
              console.log(this.imagePreviews[0].url);        
            },
            error: (err) => {
              console.error('Error loading products:', err);
            },
            complete: () => {  
              this.imagePreviews = [{
                url: this.product.images[0],
                file: null                   
              }];
              this.productForm.patchValue({
                title: this.product.title,
                description: this.product.description,
                price: this.product.price,
                brand: this.product.brand,
                tags: this.product.tags,                       
              });               
            } 
          });
        }     
    this.initializeForm();      
    this.setupFormChanges();           
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      title: [this.title || '', Validators.required],
      description: [
        this.product?.description || '', 
        [Validators.required, Validators.minLength(20)]
      ],
      price: [
        this.product?.price || 0, 
        [Validators.required, Validators.min(0)]
      ],
      brand: [this.product?.brand || '', Validators.required],
      tags: this.fb.array([]),
      images: this.fb.array(this.product?.images || [])
    });

    if (!this.product && this.tags.length === 0) {
      this.addTag();
    }
  }

  setupFormChanges(): void {
    this.productForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {     
      });
  }

  get tags(): FormArray {
    return this.productForm.get('tags') as FormArray;
  }

  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  addTag(tag: string = ''): void {
    this.tags.push(this.fb.control(tag, Validators.required));
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }


  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.images.removeAt(index);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      this.imagePreviews = [];
      while (this.images.length > 0) {
        this.images.removeAt(0);
      }

      Array.from(input.files).forEach(file => {
        if (!file.type.match('image.*')) {
          return; 
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);

        this.images.push(this.fb.control(file));
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      
      Object.keys(this.productForm.value).forEach(key => {
        if (key !== 'images') {
          formData.append(key, this.productForm.value[key]);
        }
      });

      for (let i = 0; i < this.images.length; i++) {
        formData.append('images', this.images.at(i).value);
      }

      console.log('Form data ready for upload:', formData);
      let productModel: IProduct = this.productForm.value as IProduct;
      if(!this.editProduct)
      {
        this.prdservice.AddProduct(formData).subscribe({
          next: (response) => {
            console.log('Product added successfully', response);
          },
          error: (err) => {
            console.error('Error adding product', err);
          },
          complete: () =>{
            this.router.navigateByUrl('/Products')
          }
        });
      }
      else{
        this.prdservice.updateProduct(this.CurrProductId,productModel).subscribe({
          next: (response) => {
            console.log('Product updated successfully', response);
          },
          error: (err) => {
            console.error('Error adding product', err);
          },
          complete: () =>{
            this.router.navigateByUrl('/Products')
          }          
        });
      }
    }
  }

  onReset(): void {
    if (this.product) {
      this.initializeForm();
    } else {
      this.productForm.reset({
        title: '',
        description: '',
        price: 0,
        brand: '',
        tags: [''],
        images: []
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}