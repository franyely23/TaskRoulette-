import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
<<<<<<< HEAD
export class Tab2Page {
=======
export class Tab2Page  {
>>>>>>> e0d4ecc5f73b9036bc7fee7a7d484f9dbb1ee464

  nuevaTarea: string = '';
  tareas: string[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  async ionViewWillEnter() {
<<<<<<< HEAD
    await this.cargarTareas();
  }
=======
  await this.cargarTareas();
}
>>>>>>> e0d4ecc5f73b9036bc7fee7a7d484f9dbb1ee464

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