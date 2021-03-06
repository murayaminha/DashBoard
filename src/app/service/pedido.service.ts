import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pedido } from 'src/app/model/Pedido';
import { map } from 'rxjs/operators';
import { EnderecoService } from './endereco.service';
import { Carrinho } from 'src/app/model/carrinho';
import { Detalhe } from 'src/app/model/detalhe';
import { StatusRequest } from '../model/StatusRequest';



function adaptar(data: any[]) {
  return data.map(
    elem => new Pedido(elem.price,
      elem.priceFreight,
      elem.statusRequest,
      elem.date,
      elem.client,
      elem.payment,
      elem.name,
      elem.phone,
      elem.address,
      elem.id
    )
  )
}

function adaptar3(data: any[]) {
  console.log(data)
  return data.map(
    elem => new Detalhe(elem.code,
      elem.valueProduct,
      elem.valueFreight,
      elem.amount,
      elem.codProduct,
      new Pedido(elem.request.price,
        elem.request.priceFreight,
        elem.request.date, elem.request.client,
        elem.request.payment, elem.request.name, elem.request.phone, elem.request.address, elem.request.statusRequest, elem.request.id)
    ))
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  constructor(public http: HttpClient, private httpAddress: EnderecoService) { }

  // public buscarPedido(code: number) {
  //   return this.http.get(`/api/buscarRequest/${code}`)
  // }

  adaptador2 = (pedido: Pedido) => {
    return {
      "price": pedido.price,
      "priceFreight": pedido.priceFreight,
      "statusRequest": pedido.statusRequest,
      "date": pedido.date,
      "client": pedido.client,
      "payment": pedido.payment,
      "name": pedido.name,
      "phone": pedido.phone,
      "address": this.httpAddress.enderecoBanco(pedido.address)
    }

  }


  public envPedido(pedido: Pedido) {
    let comunicacao = this.adaptador2(pedido)
    let url = this.http.post('/api/request', comunicacao);
    return url.pipe(map(
      dados => dados
    ));
  }

  public envItemCart(pedido: Pedido, carrinho: Carrinho[]) {
    for (let i = 0; i < carrinho.length; i++) {
      let comunicacao = {
        "codProduct": carrinho[i].produto,
        "amount": carrinho[i].quantidade,
        "valueFreight": pedido.priceFreight,
        "valueProduct": carrinho[i].produto.valueProduct,
        "request": pedido
      }
      let url = this.http.post('/api/create-itemcart', comunicacao)
      url.pipe(
        map(
          dados => dados
        )
      ).subscribe(
        elemento => {
          elemento
        }
      )
    }
  }

  details(code: number) {
    return this.http.get(`/api/find-itemcart/${code}`).pipe(
      map(adaptar3)
    )
  }
  buscarPedidos() {
    return this.http.get("/api/buscarRequest").pipe(
      map(adaptar3)
    )
  }
 

  buscarPedidoId(id) {
    return this.http.get("/api/buscarPedidoID/" + id).pipe(
    )
  }
  alterar(pedido: StatusRequest) {
    return this.http.post(`/api/adicionar-statusRequest`, pedido)
  }


  listarStatus(status: string) {
    return this.http.get(`/api/listar-status/${status}`).pipe()
  }

  // listarStatusPagamento(pagamento: string) {
  //   return this.http.get(`/api/listar_payment/${pagamento}`)
  // }
}
