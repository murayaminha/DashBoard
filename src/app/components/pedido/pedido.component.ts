
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/service/pedido.service';
import { Detalhe } from 'src/app/model/detalhe';
import { PedidoDetalhe } from 'src/app/model/pedidoDetalhe';
import { StatusRequest } from 'src/app/model/StatusRequest';
import { EmissorDeEventosService } from 'src/app/service/emissor-de-eventos.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  formularioStatus: FormGroup
  constructor(private http: PedidoService, private emissor : EmissorDeEventosService,private fb: FormBuilder) {
    this.emissor.emissor.subscribe(()=>this.mostrarPedidos())
  }
  
  detalhe: Detalhe[]
  carregar: boolean
  // pedido: PedidoDetalhe[] = []
  pedido: any = []

  adaptar(det: Detalhe) {
    return {
      "detalhe": det,
      "quantidade": det.request.statusRequest.length
    }
  }

  criandoForm() {
    this.formularioStatus = this.fb.group({
      status: [
        '',
        Validators.compose([
          Validators.required
        ])],
        pagamento: [
          '',
          Validators.compose([
            Validators.required
          ])],
    })
  }

  mostrarPedidos() {
    this.pedido=[]
    this.http.buscarPedidos().subscribe(data => {
      data.forEach(d =>{
        this.pedido.push(new PedidoDetalhe(d,d.request.statusRequest.length-1))
      }
      )
    })
    if (this.pedido) {
      this.carregar = true;
    }
    else { this.carregar = false }
    return this.pedido
  }

  ngOnInit(): void {
    this.mostrarPedidos()
    this.criandoForm()
  }


  listarStatus(){
    let stt = this.formularioStatus.value.status
    this.pedido=[]
    let pedidoFiltrado=[]
    this.http.buscarPedidos().subscribe(
      (data: any) => {
      pedidoFiltrado=  data.filter((event) => {
        console.log(event.request.statusRequest[event.request.statusRequest.length-1].statusRequest)
        console.log(stt)
          return event.request.statusRequest[event.request.statusRequest.length-1].statusRequest == stt
        });
        console.log(pedidoFiltrado)
        pedidoFiltrado.forEach(d=>{this.pedido.push(new PedidoDetalhe(d,d.request.statusRequest.length-1))
        console.log(this.pedido)})
        
      }, (error: any) => {
        console.error("ERROR", error)
      })
    }

}