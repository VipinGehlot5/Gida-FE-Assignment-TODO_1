// src/app/components/todo/todo.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TodoService } from 'src/app/services/todo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TodoModel } from 'src/app/services/todo.model';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, OnDestroy {
    todos: TodoModel[] = [];
    newTodo: string = '';
    subscription = new Subscription();
    newTodoTitle: string = '';

    customTodos: TodoModel[] = [];  // New property for custom to-dos
    newCustomTodoTitle: string = '';  // New property for custom todo title
    customTodoHeading: string = 'Custom To-Dos'; // Initial heading for custom todos
    showCustomTodo: boolean = true; // Control visibility of custom todos

    constructor(
        private todoService: TodoService,
    ) { }

    ngOnInit(): void {
        // console.log('todos:', this.todos);
        this.loadTodos();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadTodos(): void {
        const storedTodos = localStorage.getItem('todos');
        // if (storedTodos) {
        //     this.todos = JSON.parse(storedTodos);
        //     // this.todos = this.todos.filter(each => each.userId == 2);
        //     console.log('todos:', this.todos);
        // } else {}
        this.todoService.getTodos().subscribe({
            next: (response) => {
                this.todos = response.slice(0, 20);
                console.log('todos:', this.todos);

                this.saveTodos();
            },
            error: (errorMessage) => {
                console.log('error : ', errorMessage);
            }
        })
    }

    addTodo(): void {
        if (this.newTodoTitle.trim()) {
            const newTodo: Partial<TodoModel> = {
                userId: 1,
                title: this.newTodoTitle,
                completed: false
            };
            this.todoService.addTodo(newTodo).subscribe({
                next: (response) => {
                    this.todos.push(response);
                    this.saveTodos();
                    this.newTodoTitle = '';
                },
                error: (errorMessage) => {
                    console.log('error : ', errorMessage);
                }
            })
        }
    }

    toggleTodoCompletion(todo: TodoModel): void {
        todo.completed = !todo.completed;
        this.saveTodos();
    }

    deleteTodo(todo: TodoModel): void {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.saveTodos();
    }

    private saveTodos(): void {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    get completedTodos() {
        return this.todos.filter(todo => todo.completed);
    }

    get incompleteTodos() {
        return this.todos.filter(todo => !todo.completed);
    }

    // Methods for Custom To-Dos
    addCustomTodo(): void {
        if (this.newCustomTodoTitle.trim()) {
            const newCustomTodo: Partial<TodoModel> = {
                userId: 2,  // or any other identifier for custom todos
                title: this.newCustomTodoTitle,
                completed: false
            };
            this.customTodos.push(newCustomTodo as TodoModel);  // Directly add to customTodos
            this.saveCustomTodos();
            this.newCustomTodoTitle = '';
        }
    }

    toggleCustomTodoCompletion(customTodo: TodoModel): void {
        customTodo.completed = !customTodo.completed;
        this.saveCustomTodos();
    }

    deleteCustomTodo(customTodo: TodoModel): void {
        this.customTodos = this.customTodos.filter(t => t.id !== customTodo.id);
        this.saveCustomTodos();
    }

    // private saveTodos(): void {
    //     localStorage.setItem('todos', JSON.stringify(this.todos));
    // }

    private saveCustomTodos(): void {
        localStorage.setItem('customTodos', JSON.stringify(this.customTodos));
    }

    get completedCustomTodos() {
        return this.customTodos.filter(todo => todo.completed);
    }

    get incompleteCustomTodos() {
        return this.customTodos.filter(todo => !todo.completed);
    }

    // toggleCustomTodoVisibility(): void {
    //     this.showCustomTodo = !this.showCustomTodo;
    //     this.loadTodos();
    // }
}
