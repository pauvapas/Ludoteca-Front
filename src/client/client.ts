import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, throwError } from 'rxjs';
import { Client } from './model/Client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ClientService {
  protected readonly http = inject(HttpClient);

  private baseUrl = 'http://localhost:8080/client';

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  saveClient(client: Client): Observable<Client> {
    const { id } = client;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Client>(url, client).pipe(
        catchError((error) => {
            console.error('Client Service Error:', error);
            alert("No se ha podido crear/actualizar el cliente porque ya existe uno en BD con el mismo nombre");
            return throwError(() => new Error('No se ha podido crear/actualizar el cliente porque ya existe uno en BD con el mismo nombre'));
        })
    );
  }

  deleteClient(idClient : number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idClient}`).pipe(
        catchError((error) => {
            console.error('Client Service Error:', error);
            alert("No se ha podido eliminar el cliente " + idClient +  " porque existe un préstamo asociado");
            return throwError(() => new Error('No se ha podido eliminar el cliente ' + idClient +  ' porque existe un préstamo asociado'));
        })
    );
  }  
}