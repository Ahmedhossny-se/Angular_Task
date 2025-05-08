import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './Components/main-layout/main-layout.component';
import { ProductsComponent } from './Components/products/products.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { ProductFormComponent } from './Components/product-form/product-form.component';

const routes: Routes = 
[
  {path:'',component:MainLayoutComponent, children:
    [
      {path:'',redirectTo:'/Products', pathMatch:'full'},
      {path:'Products', component:ProductsComponent},
      {path:'Adds/:pid', component:ProductFormComponent},
      {path:'Add', component:ProductFormComponent}
    ]},   
  {path:"**",component:NotFoundComponent}//wild card path must be last
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
