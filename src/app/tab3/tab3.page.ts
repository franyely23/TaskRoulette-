import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { P2pService } from '../services/p2p';
import { Router } from '@angular/router';
import { AudioService } from '../services/audio.service';

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
  
  animacionActiva: boolean = false; 

  ruletaGradient: string = '';

  constructor(
    private storageService: StorageService,
    public p2pService: P2pService,
    private router: Router,
    private audioService: AudioService
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

    setTimeout(() => {
      this.animacionActiva = false;
    }, 0);
  }

  ionViewWillLeave() {
    this.audioService.detener();
  }

  generarRuleta() {
    if (this.tareas.length === 0) return;

    const totalSegs = this.tareas.length;
    const gradoPorSegmento = 360 / totalSegs;
    let partesGradient: string[] = [];

    for (let i = 0; i < totalSegs; i++) {
      const hue = Math.floor((360 / totalSegs) * i);
      
      const color = `hsl(${hue}, 80%, 55%)`; 

      const inicio = i * gradoPorSegmento;
      const fin = (i + 1) * gradoPorSegmento;

      partesGradient.push(`${color} ${inicio}deg ${fin}deg`);
    }

    this.ruletaGradient = `conic-gradient(${partesGradient.join(', ')})`;
  }

  girarRuleta() {
    if (this.tareas.length === 0) {
      this.audioService.reproducir('click');
      return;
    }

    this.audioService.reproducir('ruleta');

    this.girando = true;
    this.tareaSeleccionada = '';
    this.animacionActiva = true;

    const vueltas = 5;
    const indice = Math.floor(Math.random() * this.tareas.length);
    const tamañoSegmento = 360 / this.tareas.length;
    const centroSegmento = tamañoSegmento / 2;

    this.angulo += (vueltas * 360) + (indice * tamañoSegmento) + centroSegmento;

    setTimeout(async () => {
      this.audioService.detener();

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