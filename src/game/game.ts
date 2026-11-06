import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, throwError } from 'rxjs';
import { Game } from './model/Game';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
providedIn: 'root',
})
export class GameService {
    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/game';

    getGames(title?: string, categoryId?: number): Observable<Game[]> {
        return this.http.get<Game[]>(this.composeFindUrl(title, categoryId));
        //return of(GAME_DATA);
    }

    saveGame(game: Game): Observable<void> {
        const { id } = game;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;

        return this.http.put<void>(url, game).pipe(
                    catchError(this.handleError)
        );
    }

    private composeFindUrl(title?: string, categoryId?: number): string {
        const params = new URLSearchParams();
        if (title) {
          params.set('title', title);
        }  
        if (categoryId) {
            params.set('idCategory', categoryId.toString());
        }
        const queryString = params.toString();
        return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    }
    
    getAllGames(): Observable<Game[]> {
        return this.http.get<Game[]>(this.baseUrl);
    }

    private handleError(error: HttpErrorResponse) {
        let message;

        message = error.error;

        alert("Todos los campos del formulario son obligatorios");

        return throwError(() => new Error(message));
    }
}