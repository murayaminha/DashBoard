import { ProductAPI } from './../model/productAPI';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';


@Injectable({
  providedIn: 'root'
})

export class ProductService {

img: string = "../../../assets/Imagem/"

  constructor(private http: HttpClient) { }


  public delete(id){
    return this.http.delete(`/api/product/${id}`)
  }


  public findByProductsCode(code: number) {
    return this.http.get(`/api/product-id/${code}`)
  }

  public alterar(product: ProductAPI){
    console.log(product.valueProduct * 0.3);
    
    let produto = {
      codProduct: product.codProduct,
      description: product.description,
      name: product.name,
      image: this.img+product.image.slice(12, product.image.length),
      category:{
        id :product.category,
      },
      valueProduct: product.valueProduct,
      valueDiscount:  product.valueProduct * 0.3,
      brand: product.brand,
      model: product.model,
    }
    return this.http.put(`/api/product`,produto)
    }


  public create(product: ProductAPI){
  let produto = {
    description: product.description,
    name: product.name,
    image: this.img+product.image.slice(12, product.image.length),
    category:{
      id :product.category,
    },
    valueProduct: product.valueProduct,
    valueDiscount: product.valueProduct * 0.3,
    brand: product.brand,
    model: product.model,
  }
    return this.http.post(`/api/create-product`, produto)
  }


}
