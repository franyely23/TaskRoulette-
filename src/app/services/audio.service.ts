import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audioActual: HTMLAudioElement | null = null; 

  constructor() { }

  reproducir(nombreSonido: string) {
    this.detener();

    this.audioActual = new Audio();
    this.audioActual.src = `assets/sounds/${nombreSonido}.mp3`;
    this.audioActual.load();
    this.audioActual.play().catch(err => console.log('Error al reproducir:', err));
  }

  detener() {
    if (this.audioActual) {
      this.audioActual.pause();
      this.audioActual.currentTime = 0;
      this.audioActual = null;
    }
  }
}