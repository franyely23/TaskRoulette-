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

  

  ruletaGradient: string = '';

  constructor(
    private storageService: StorageService,
    public p2pService: P2pService,
    private router: Router
  ) {}

  async ionViewWillEnter() {

  this.tareaSeleccionada = '';
  this.girando = false;

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

  // Espera un ciclo del navegador antes de permitir nuevas animaciones
  setTimeout(() => {
    this.animacionActiva = false;
  }, 0);
}

  generarRuleta() {
    if (this.tareas.length === 0) return;

    const totalSegs = this.tareas.length;
    const gradoPorSegmento = 360 / totalSegs;
    let partesGradient: string[] = [];

    for (let i = 0; i < totalSegs; i++) {
      // Calculamos un tono (hue) único para cada segmento en el círculo cromático de 360 grados
      const hue = Math.floor((360 / totalSegs) * i);
      
      // HSL: hue (color dinámico), saturación 80% (vivo), luminosidad 55% (brillante para tu fondo oscuro)
      const color = `hsl(${hue}, 80%, 55%)`; 

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
  this.animacionActiva = true;

  const vueltas = 5; // número de vueltas completas
  const indice = Math.floor(Math.random() * this.tareas.length);
  const tamañoSegmento = 360 / this.tareas.length;
  const centroSegmento = tamañoSegmento / 2;

  // IMPORTANTE: acumular sobre el ángulo actual
  this.angulo += (vueltas * 360) + (indice * tamañoSegmento) + centroSegmento;

  setTimeout(async () => {
    this.girando = false;
    this.animacionActiva = false;
    this.tareaSeleccionada = this.tareas[indice];
    await this.storageService.set('tarea_pendiente', this.tareaSeleccionada);
    if (this.p2pService.conectadoA) {
      await this.p2pService.transferirTareasPendientes();
    }
    this.router.navigateByUrl('/pomodoro', { replaceUrl: true });
  }, 3000);
}

}