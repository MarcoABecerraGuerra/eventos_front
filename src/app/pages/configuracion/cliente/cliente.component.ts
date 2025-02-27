import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/services/configuracion/cliente.service';
import { NewClienteComponent } from './new-cliente/new-cliente.component';
import { EditClienteComponent } from './edit-cliente/edit-cliente.component';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit{

  filterCliente: FormGroup;
  submitted: boolean = false;
  clienteList: any[] = [];

  constructor(private _fb: FormBuilder,
    private _modalService: NgbModal,
    private _clienteService: ClienteService
  ){
    this.filterCliente = _fb.group({
      nombreCliente: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.obtenerListaClientes();
  }

  OpenModalNuevoCliente(){

    const modalRef = this._modalService.open(NewClienteComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl'
    });
    modalRef.componentInstance.notifyParent.subscribe(($event: any) => {
      this.openAlerta('Operación Exitosa', $event);
      this.obtenerListaClientes();
    });

  }

  OpenModalEditarCliente(cliente: any){

    const modalRef = this._modalService.open(EditClienteComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl'
    });
    modalRef.componentInstance.cliente = cliente;
    modalRef.componentInstance.notifyParent.subscribe(($event: any) => {
      this.openAlerta('Operación Exitosa', $event);
      this.obtenerListaClientes();
    });

  }

  obtenerListaClientes(){
    let data = {};
    this._clienteService.ObtenerLista(data).subscribe(
      (val) =>{
        this.clienteList = val.data;
    });

  }

  openAlerta(titulo: string, mensaje: string) {
    const modalRef = this._modalService.open(AlertComponent , {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    modalRef.componentInstance.title = titulo;
    modalRef.componentInstance.text = mensaje;
  }

  EliminarCliente(cliente: any){
    const dataToSend = cliente;
    this._clienteService.Eliminar(dataToSend).subscribe({
      next: (data) => {
        this.openAlerta("Alerta", data.message);
        this.obtenerListaClientes();
      },
      error: (err) => {
        this.openAlerta("Alerta", JSON.parse(err.message).message);
      }
    });
  }

  EliminarClienteAlert(cliente: any){
    const modalRef = this._modalService.open(AlertComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    modalRef.componentInstance.title = 'Alerta!';
    modalRef.componentInstance.text = `¿Está seguro de eliminar el distrito ${cliente.nombre}`;
    modalRef.componentInstance.showButtonConfirm = true;
    modalRef.componentInstance.showButtonCancell = true;
    modalRef.componentInstance.textConfirm = 'SI';
    modalRef.componentInstance.textCancell = 'NO';
    modalRef.componentInstance.notifyParent.subscribe(($event: any) => {
      this.EliminarCliente(cliente);
    });
  }

}
