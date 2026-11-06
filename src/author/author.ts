import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, throwError } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Author } from './model/Author';
import { PaginatedData } from '../core/model/page/PaginatedData';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthorService {
    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/author';

    getAuthors(pageable: Pageable): Observable<PaginatedData<Author>> {
        return this.http.post<PaginatedData<Author>>(this.baseUrl, { pageable: pageable });
    }

    saveAuthor(author: Author): Observable<Author> {
        const { id } = author;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Author>(url, author).pipe(
            catchError(this.handleError)
        );
    }

    deleteAuthor(idAuthor: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${idAuthor}`).pipe(
            catchError((error) => {
                console.error('Author Service Error:', error);
                alert("No se ha podido eliminar el autor " + idAuthor +  " porque existe un juego asociado");
                return throwError(() => new Error('No se ha podido eliminar el autor ' + idAuthor +  ' porque existe un juego asociado'));
            })
        );
    }

    getAllAuthors(): Observable<Author[]> {
        return this.http.get<Author[]>(this.baseUrl);
    }

    private handleError(error: HttpErrorResponse) {
        let message;

        message = error.error;
        
        switch(message){
            case 'Author name/nationality cannot be empty':
                alert('Todos los campos del autor son obligatorios');
                break;
            default:
                alert("Todos los campos del formulario son obligatorios");
                break;
        }

        return throwError(() => new Error(message));
    }
}