import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AudioService } from '../services/audio.service'; // 1. Importamos el servicio

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
    private router: Router,
    private audioService: AudioService // 2. Inyectamos el servicio en el constructor
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

    // 3. Reproducimos el sonido al agregar una tarea
    this.audioService.reproducir('click');

    this.tareas.push(this.nuevaTarea);
    this.nuevaTarea = '';
    
    await this.guardarTareas();
  }

  async eliminarTarea(index: number) {
    // 4. Reproducimos el sonido al eliminar
    this.audioService.reproducir('click');
    
    this.tareas.splice(index, 1);
    await this.guardarTareas();
  }

  irARuleta() {
    // 5. Reproducimos el sonido al cambiar de pantalla
    this.audioService.reproducir('click');
    
    this.router.navigate(['/tabs/tab3']);
  }
}