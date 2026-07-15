import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private urlFrases = 'https://dummyjson.com/quotes/random';
  
  private urlNube = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) { }

  obtenerFraseMotivacional(): Observable<any> {
    return this.http.get(this.urlFrases);
  }

  guardarTareaEnLaNube(nombreTarea: string): Observable<any> {
    const body = {
      title: nombreTarea,
      body: 'Tarea completada en TaskRoulette usando Pomodoro',
      userId: 1,
    };
    
    return this.http.post(this.urlNube, body);
  }
}