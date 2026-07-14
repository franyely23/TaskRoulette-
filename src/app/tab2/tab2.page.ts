import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  nuevaTarea: string = '';
  tareas: string[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    await this.cargarTareas();
  }

  async cargarTareas() {
    const data = await this.storageService.get('tareas');
    if (data) {
      this.tareas = data;
    }
  }

  async guardarTareas() {
    await this.storageService.set('tareas', this.tareas);
  }

  async agregarTarea() {
    if (!this.nuevaTarea.trim()) return;

    this.tareas.push(this.nuevaTarea);
    this.nuevaTarea = '';
    
    await this.guardarTareas();
  }

  async eliminarTarea(index: number) {
    this.tareas.splice(index, 1);
    await this.guardarTareas();
  }

  irARuleta() {
    this.router.navigate(['/tabs/tab3']);
  }
}