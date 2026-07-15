import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { AudioService } from '../services/audio.service';
import { ApiService } from '../services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.page.html',
  styleUrls: ['./pomodoro.page.scss'],
  standalone: false,
})
export class PomodoroPage {
  tareaActual: string = '';

  tiempoInicial: number = 5; 
  tiempoRestante: number = this.tiempoInicial;
  intervalo: any;
  corriendo: boolean = false;
  pomodoroTerminado: boolean = false;

  fraseDelDia: string = 'Cargando motivación...';
  autorDelDia: string = '';

  constructor(
    private storageService: StorageService,
    private router: Router,
    private audioService: AudioService,
    private apiService: ApiService,
    private toastController: ToastController
  ) {}

  async ionViewWillEnter() {
    this.pomodoroTerminado = false;
    this.tiempoRestante = this.tiempoInicial;
    this.corriendo = false;
    clearInterval(this.intervalo);

    this.cargarFrase();

    const tarea = await this.storageService.get('tarea_pendiente');

    if (tarea) {
      this.tareaActual = tarea;
    }
  }

  ionViewWillLeave() {
    this.audioService.detener();
  }

  cargarFrase() {
    this.apiService.obtenerFraseMotivacional().subscribe({
      next: (respuesta) => {
        this.fraseDelDia = respuesta.quote;
        this.autorDelDia = respuesta.author;
      },
      error: (err) => {
        console.error(err);
        this.fraseDelDia = 'La disciplina es el puente entre metas y logros.';
        this.autorDelDia = 'TaskRoulette';
      }
    });
  }

  iniciar() {
    this.audioService.reproducir('click');

    if (this.corriendo) return;
    
    this.corriendo = true;
    
    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        this.finalizar();
      }
    }, 1000);
  }

  pausar() {
    this.audioService.reproducir('click');

    this.corriendo = false;
    clearInterval(this.intervalo);
  }

  reiniciar() {
    this.audioService.reproducir('click');

    this.corriendo = false;
    clearInterval(this.intervalo);
    this.tiempoRestante = this.tiempoInicial;
    this.pomodoroTerminado = false;
  }

  finalizar() {
    if (this.pomodoroTerminado) return; 

    this.corriendo = false;
    clearInterval(this.intervalo);

    this.tiempoRestante = 0;
    this.pomodoroTerminado = true;
    
    this.audioService.reproducir('alarma'); 
  }

  mostrarTiempo() {
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;

    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  }

  async completarTarea() {
    this.audioService.reproducir('click');

    this.apiService.guardarTareaEnLaNube(this.tareaActual).subscribe({
      next: async (respuesta) => {
        console.log(respuesta);
        
        const toast = await this.toastController.create({
          message: `¡Guardado en la nube exitoso! (ID: ${respuesta.id})`,
          duration: 3000,
          color: 'success',
          position: 'top',
          icon: 'cloud-done'
        });
        await toast.present();

        await this.borrarTareaLocalYNavegar();
      },
      error: async (err) => {
        console.error(err);
        
        const toastError = await this.toastController.create({
          message: 'Error al conectar con la nube.',
          duration: 3000,
          color: 'danger',
          position: 'top',
          icon: 'alert-circle'
        });
        await toastError.present();

        await this.borrarTareaLocalYNavegar();
      }
    });
  }

  private async borrarTareaLocalYNavegar() {
    const tareas = await this.storageService.get('tareas');

    if (tareas) {
      const nuevasTareas = tareas.filter((tarea: string) => tarea !== this.tareaActual);
      await this.storageService.set('tareas', nuevasTareas);
    }

    await this.storageService.remove('tarea_pendiente');
    
    setTimeout(() => {
      this.router.navigate(['/tabs/tab2']);
    }, 200);
  }

  mantenerTarea() {
    this.audioService.reproducir('click');

    setTimeout(() => {
      this.router.navigate(['/tabs/tab3']);
    }, 200);
  }
}