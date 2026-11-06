import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, throwError } from 'rxjs';
import { Category } from './model/category';

@Injectable({
providedIn: 'root'
})
export class CategoryService {
    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/category';

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.baseUrl);
    }

    saveCategory(category: Category): Observable<Category> {
        const { id } = category;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Category>(url, category);
    }

    deleteCategory(idCategory : number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${idCategory}`).pipe(
            catchError((error) => {
                console.error('Category Service Error:', error);
                alert("No se ha podido eliminar la categoría " + idCategory +  " porque existe un juego asociado");
                return throwError(() => new Error('No se ha podido eliminar la categoría ' + idCategory +  ' porque existe un juego asociado'));
            })
        );
    }  
}