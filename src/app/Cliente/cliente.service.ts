import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Config } from 'src/interfaces/Config';

@Injectable()
export class ClienteService {

  constructor(private http: HttpClient) { }
}