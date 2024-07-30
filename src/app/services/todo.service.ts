// src/app/services/todo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { TodoModel } from './todo.model';

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

    constructor(private http: HttpClient) { }

    getTodos(): Observable<TodoModel[]> {
        return this.http.get<TodoModel[]>(this.apiUrl)
            .pipe(
                retry(1),
                map((response) => {
                    console.log('[getTodos] response : ', response);
                    return response;
                }),
                catchError((error) => {
                    console.log('[getTodos] error : ', error);
                    const message = error.error.message ? error.error.message : 'Error';
                    return throwError(() => message)
                })
            );
    }

    addTodo(todo: Partial<TodoModel>): Observable<TodoModel> {
        return this.http.post<TodoModel>(this.apiUrl, todo)
            .pipe(
                retry(1),
                map((response) => {
                    console.log('[addTodo] response : ', response);
                    return response;
                }),
                catchError((error) => {
                    console.log('[addTodo] error : ', error);
                    const message = error.error.message ? error.error.message : 'Error';
                    return throwError(() => message)
                })
            );
    }

    // deleteTodo(todo: Partial<TodoModel>): Observable<TodoModel> {
    //     return this.http.delete<TodoModel>(this.apiUrl, todo)
    //         .pipe(
    //             retry(1),
    //             map((response) => {
    //                 console.log('[deleteTodo] response : ', response);
    //                 return response;
    //             }),
    //             catchError((error) => {
    //                 console.log('[deleteTodo] error : ', error);
    //                 const message = error.error.message ? error.error.message : 'Error';
    //                 return throwError(() => message)
    //             })
    //         );
    // }
}
