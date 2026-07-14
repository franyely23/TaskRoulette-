import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { P2pService } from '../services/p2p';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  tareas: string[] = [];
  angulo: number = 0;
  girando: boolean = false;
  tareaSeleccionada: string = '';
  
  // Variable para controlar que la animación solo ocurra al hacer clic
  animacionActiva: boolean = false; 

  colores: string[] = [
    '#4f46e5',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#3b82f6',
    '#a855f7'
  ];

  ruletaGradient: string = '';

  constructor(
    private storageService: StorageService,
    public p2pService: P2pService,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    this.tareaSeleccionada = '';
    this.girando = false;
    
    // Apagamos la animación antes de que la ruleta vuelva a 0 grados
    this.animacionActiva = false; 
    this.angulo = 0;

    const data = await this.storageService.get('tareas');

    if (data) {
      this.tareas = data;
      this.generarRuleta();
    } else {
      this.tareas = [];
      this.ruletaGradient = '';
    }
  }

  generarRuleta() {
    if (this.tareas.length === 0) return;

    const totalSegs = this.tareas.length;
    const gradoPorSegmento = 360 / totalSegs;
    let partesGradient: string[] = [];

    for (let i = 0; i < totalSegs; i++) {
      const color = this.colores[i % this.colores.length];
      const inicio = i * gradoPorSegmento;
      const fin = (i + 1) * gradoPorSegmento;

      partesGradient.push(`${color} ${inicio}deg ${fin}deg`);
    }

    this.ruletaGradient = `conic-gradient(${partesGradient.join(', ')})`;
  }

  girarRuleta() {
    if (this.tareas.length === 0) return;

    this.girando = true;
    this.tareaSeleccionada = '';
    
    // Encendemos la animación justo en el momento de iniciar el giro
    this.animacionActiva = true; 

    const vueltas = 5;
    const indice = Math.floor(Math.random() * this.tareas.length);
    const tamañoSegmento = 360 / this.tareas.length;
    const centroSegmento = tamañoSegmento / 2;

    this.angulo = (vueltas * 360) + (indice * tamañoSegmento) + centroSegmento;

    setTimeout(async () => {
      this.girando = false;
      this.tareaSeleccionada = this.tareas[indice];

      await this.storageService.set('tarea_pendiente', this.tareaSeleccionada);

      if (this.p2pService.conectadoA) {
        await this.p2pService.transferirTareasPendientes();
      }

      this.router.navigate(['/pomodoro']);
    }, 3000);
  }
}