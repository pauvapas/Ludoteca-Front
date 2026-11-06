import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, throwError } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Loan } from './model/Loan';
import { PaginatedData } from "../core/model/page/PaginatedData";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class LoanService {
    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/loan';

    getLoans(pageable: Pageable, gameId?: number, clientId?: number, date?: string): Observable<PaginatedData<Loan>> {
        return this.http.post<PaginatedData<Loan>>(this.composeFindUrl(gameId, clientId, date), { pageable: pageable });
    }

    saveLoan(loan: Loan): Observable<Loan> {
        const { id } = loan;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Loan>(url, loan).pipe(
            catchError(this.handleError)
        );
    }

    deleteLoan(idLoan: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
    }

    private composeFindUrl(gameId?: number, clientId?: number, date?: string): string {
        const params = new URLSearchParams();
        if (gameId) {
            params.set('idGame', gameId.toString());
        }  
        if (clientId) {
            params.set('idClient', clientId.toString());
        }
        if (date) {
            params.set('date', date);
        }  
        const queryString = params.toString();
        return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    }

    private handleError(error: HttpErrorResponse) {
        let message;

        message = error.error;

        switch (message) {
            case 'Client has a current loan for the chosen dates':
                alert('El cliente ya tiene un préstamo para esas fechas');
                break;

            case 'Game is already loaned for the chosen dates':
                alert('El juego ya está prestado para esas fechas');
                break;

            case 'The loan cannot exceed 14 days':
                alert('El préstamo no puede superar los 14 días');
                break;

            case 'endDate cannot be earlier than startDate':
                alert('La fecha de fin no puede ser anterior a la fecha de inicio');
                break;

            default:
                alert("Todos los campos del formulario son obligatorios");
        }

        return throwError(() => new Error(message));
    }
}