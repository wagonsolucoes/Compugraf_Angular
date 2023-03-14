import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ClienteService } from './Cliente/cliente.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Config } from 'src/interfaces/Config';
import {FocusMonitor} from '@angular/cdk/a11y';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import { Cliente } from './Cliente/Cliente';
import { IConfig } from 'ngx-mask'
import {DropdownModule} from 'primeng/dropdown';
import { FormControl } from '@angular/forms';
import { ClienteErro } from './Cliente/ClienteErro';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { RequestList } from 'src/interfaces/RequestList';
import {ChipsModule} from 'primeng/chips';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

let req : RequestList
let msgErro: string;
let cpf: string;
let Search: string;
let Operacao: string="";
let Coluna:string="";
let nome: string;
let sobrenome: string;
let clis:Array<Cliente>=[];
let showList:boolean=true;
let showForm:boolean=false;
let showConfirma:boolean=false;
let arrChips:string[]=[];

const configUrl = 'assets/config.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


@Injectable()
export class AppComponent implements OnInit  {
  arrChips:string[]=[];
  req = {} as RequestList
  modalRef: MdbModalRef<AppComponent> | null = null;
  frm = {} as Cliente
  er = {} as ClienteErro
  cpf: string="";
  nome: string="";
  sobrenome: string="";
  clis:Array<Cliente>=[];
  msgErro: string="";
  Search: string="";
  Operacao: string="";
  Coluna:string="";
  confirmaApagar:boolean=false;
  showList:boolean=true;
  showForm:boolean=false;
  showConfirma:boolean=false;
  router: any;
    constructor(private http: HttpClient) {     
  }

  title = 'Compugraf';
  displayedColumns: string[] = ['cpf', 'nome', 'sobrenome', 'email','telefone','actions'];

  ngOnInit() {
    this.msgErro="";
    this.nome="";
    this.sobrenome="";
    this.ListaClientes(true);
    this.showList=true;
    this.showForm=false;
    this.showConfirma=false;
  }

  CloseForm(){
    this.msgErro="";
    this.nome="";
    this.sobrenome="";
    this.frm = {} as Cliente
    this.frm.Novo=true;
    this.showList=true;
    this.showForm=false;
    this.showConfirma=false;
  }

  OpenForm(){
    this.msgErro="";
    this.nome="";
    this.sobrenome="";
    this.frm = {} as Cliente
    this.frm.Novo=true;
    this.showList=false;
    this.showForm=true;
    this.showConfirma=false;
  }

  Salvar(){
      this.InsertUpdateAsync(this.frm);
  }

  LimpaSearch(){
    this.msgErro="";
    this.arrChips=[];
    this.Coluna="";
    this.Operacao="";
    this.Search="";
    this.req = {} as RequestList
    this.req.Page=1;
    this.req.Rows=10;
    this.req.ColDirectrion = ["ASC"];
    this.req.ColOrder = ["Nome"];
    this.req.ColFilter = [];
    this.req.ValFilter = [];
    this.req.OperatorFilter = [];
    this.ListaClientes(false)
  }

  AddSearch(){
    this.req.Page=1;
    this.req.Rows=10;
    this.req.ColDirectrion = ["ASC"];
    
    this.req.ColOrder = ["Nome"];

    if(this.req.ColFilter == null && this.Coluna != ''){
      this.req.ColFilter = [this.Coluna];
    }
    else if(this.req.ColFilter != null && this.Coluna != ''){
      this.req.ColFilter.push(this.Coluna);
    }
    else{
      this.req.ColFilter = [];
    }
    
    if(this.req.ValFilter == null && this.Search != ''){
      this.req.ValFilter = [this.Search];
    }
    else if(this.req.ValFilter != null && this.Search != ''){
      this.req.ValFilter?.push(this.Search);
    }
    else{
      this.req.ValFilter = [];
    }
    
    if(this.req.OperatorFilter == null && this.Operacao != ''){
      this.req.OperatorFilter = [this.Operacao];
    }
    else if(this.Operacao != ''){
      this.req.OperatorFilter?.push(this.Operacao);
    }
    else{
      this.req.OperatorFilter = [];
    }

    debugger
    if(this.arrChips.length == 0){
      this.arrChips = [this.Coluna + " " + this.Operacao + " " + this.Search];
    }
    else if(this.arrChips.length > 0){
      this.arrChips.push(this.Coluna + " " + this.Operacao + " " + this.Search);
    }
    
    this.ListaClientes(false);
  }

  PopulaSearch(){
    this.req = {} as RequestList
    this.req.Page=1;
    this.req.Rows=10;
    this.req.ColDirectrion = ["ASC"];
    
    this.req.ColOrder = ["Nome"];

    if(this.Coluna != ''){
      this.req.ColFilter = [this.Coluna];
    }
    else{
      this.req.ColFilter = [];
    }
    
    if(this.Search != ''){
      this.req.ValFilter = [this.Search];
    }
    else{
      this.req.ValFilter = [];
    }
    
    if(this.Operacao != ''){
      this.req.OperatorFilter = [this.Operacao];
    }
    else{
      this.req.OperatorFilter = [];
    }

    this.ListaClientes(false);
  }

  ListaClientes(inicial:boolean){
    this.msgErro="";
    debugger
    if(inicial){
      this.req.Page=1;
      this.req.Rows=10;
      this.req.ColDirectrion = ["ASC"];
      this.req.ColOrder = ["Nome"];
    }
    const headers = { 'content-type': 'application/json', 'Accept':'*/*'}  
    const body=JSON.stringify(this.req);
    this.http.post<any>('http://localhost:33755/Cliente/ListaClientes', body, {'headers':headers}).subscribe(data => {
      debugger
      if(data.statusCode == 200){
        this.clis=data.clientes;
      }
      else if(data.statusCode == 404){
        this.clis=[];
      }
      else{
        this.msgErro = data.msg;
      }
    });
  }

    
  Editar(cpf:string) {
    debugger
    this.msgErro="";
    const headers = { 'content-type': 'application/json', 'Accept':'*/*'}  
    this.http.get<any>("http://localhost:33755/Cliente/GetByCpf/" + cpf, {'headers':headers}).subscribe(data => {
      
    if(data.statusCode == 200){
        debugger
        this.frm.Novo=false;
        this.frm.Cpf = data.cliente.cpf;
        this.frm.Nome = data.cliente.nome;
        this.frm.Sobrenome = data.cliente.sobrenome;
        this.frm.Logradouro = data.cliente.logradouro;
        this.frm.Numero = data.cliente.numero;
        this.frm.Complemento = data.cliente.complemento;
        this.frm.Bairro = data.cliente.bairro;
        this.frm.Localidade = data.cliente.localidade;
        this.frm.Uf = data.cliente.uf;
        this.frm.Email = data.cliente.email;
        this.frm.Telefone = data.cliente.telefone;
        this.frm.Ativo = data.cliente.ativo;
        this.showList=false;
        this.showForm=true;
        this.showConfirma=false;
      }   
      else{
        this.msgErro = data.msg;
      }   
    });
  }

  InsertUpdateAsync(cliente:Cliente) {   
    this.er = {} as ClienteErro
    this.msgErro=""; 
    const headers = { 'content-type': 'application/json', 'Accept':'*/*'}
    
    const body=JSON.stringify(cliente);
    this.http.post<any>('http://localhost:33755/Cliente/InsertUpdateAsync', body, {'headers':headers}).subscribe(data => {      
      if(data.statusCode == 200){
        this.clis=data.clientes;
        this.ListaClientes(true);
        this.showList=true;
        this.showForm=false;
        this.showConfirma=false;
      }
      else{
        debugger
        this.msgErro = data.msg;
      }
    },
    (e) => {
      debugger
      if(e.error != null && e.error.errors != null){
        this.PopulaErros(e.error.errors);        
      }
    }
    );
  }

  PopulaErros(ee:any){
    if(ee.hasOwnProperty('Cpf')){
      this.er.Cpf = ee.Cpf;
    }
    if(ee.hasOwnProperty('Nome')){
      this.er.Nome = ee.Nome;
    }
    if(ee.hasOwnProperty('Sobrenome')){
      this.er.Sobrenome = ee.Sobrenome;
    }
    if(ee.hasOwnProperty('Cep')){
      this.er.Cep = ee.Cep;
    }
    if(ee.hasOwnProperty('Logradouro')){
      this.er.Logradouro = ee.Logradouro;
    }
    if(ee.hasOwnProperty('Numero')){
      this.er.Numero = ee.Numero;
    }
    if(ee.hasOwnProperty('Complemento')){
      this.er.Complemento = ee.Complemento;
    }
    if(ee.hasOwnProperty('Bairro')){
      this.er.Bairro = ee.Bairro;
    }
    if(ee.hasOwnProperty('Localidade')){
      this.er.Localidade = ee.Localidade;
    }
    if(ee.hasOwnProperty('Uf')){
      this.er.Uf = ee.Uf;
    }
    if(ee.hasOwnProperty('Email')){
      this.er.Email = ee.Email;
    }
    if(ee.hasOwnProperty('Telefone')){
      this.er.Telefone = ee.Telefone;
    }
    if(ee.hasOwnProperty('Ativo')){
      this.er.Ativo = ee.Ativo;
    }
  }

  Cancelar(){
    this.showList=true;
    this.showForm=false;
    this.showConfirma=false;
  }

  ConfirmarApagar(row:any){
    this.cpf = row.cpf;
    this.nome = row.nome;
    this.sobrenome = row.sobrenome;
    this.showList=false;
    this.showForm=false;
    this.showConfirma=true;
  }

  Apagar(cpf:string) {
    debugger
    this.msgErro="";
    const headers = { 'content-type': 'application/json', 'Accept':'*/*'}  
    this.http.get<any>("http://localhost:33755/Cliente/DeleteAsync/" + cpf, {'headers':headers}).subscribe(data => {
      debugger
      if(data.statusCode == 200){
        this.confirmaApagar = false;
        this.ListaClientes(true);
        this.nome="";
        this.sobrenome="";
        this.showList=true;
        this.showForm=false;
        this.showConfirma=false;
      }   
      else{
        this.msgErro = data.msg;
      }   
    });
  }

  BuscaCep(cep:string) {
    
    const headers = { 'content-type': 'application/json', 'Accept':'*/*'}  
    this.http.get<any>("http://localhost:33755/Cliente/ViaCep/" + cep, {'headers':headers}).subscribe(data => {
      this.frm.Logradouro = data.logradouro;
      this.frm.Numero = data.numero;
      this.frm.Complemento = data.complemento;
      this.frm.Bairro = data.bairro;
      this.frm.Localidade = data.localidade;
      this.frm.Uf = data.uf;  
    });
  }
}

