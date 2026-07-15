import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StorageService } from '../services/storage.service';
import { ToastController } from '@ionic/angular';
import { AudioService } from '../services/audio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  nombreUsuario: string = '';
  fotoPerfil: string | undefined = '';

  miUbicacion: string = '';
  mapUrl: SafeResourceUrl | null = null;
  isModalOpen: boolean = false;

  constructor(
    private storageService: StorageService,
    private toastController: ToastController,
    private sanitizer: DomSanitizer,
    private audioService: AudioService,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    const nombreGuardado = await this.storageService.get('nombre_usuario');
    const fotoGuardada = await this.storageService.get('foto_perfil');

    if (nombreGuardado) {
      this.nombreUsuario = nombreGuardado;
    }

    if (fotoGuardada) {
      this.fotoPerfil = fotoGuardada;
    }
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.audioService.reproducir('camara');
      this.fotoPerfil = image.dataUrl;

    } catch (error) {
      console.error(error);
    }
  }

  async guardarPerfil() {
    this.audioService.reproducir('click');

    if (!this.nombreUsuario || !this.nombreUsuario.trim()) {
      this.mostrarToast('Por favor ingresa un nombre de usuario', 'warning');
      return;
    }

    await this.storageService.set(
      'nombre_usuario',
      this.nombreUsuario.trim()
    );

    if (this.fotoPerfil) {
      await this.storageService.set(
        'foto_perfil',
        this.fotoPerfil
      );
    }

    this.mostrarToast(
      '¡Perfil guardado con éxito!',
      'success'
    );

    setTimeout(() => {
      this.router.navigate(['/tabs/tab2']);
    }, 500);
  }

  async obtenerUbicacion() {
    this.audioService.reproducir('click');

    try {
      this.mostrarToast(
        'Obteniendo ubicación...',
        'tertiary'
      );

      const coordinates = await Geolocation.getCurrentPosition();

      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      this.miUbicacion = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

      const delta = 0.005;

      const minLng = lng - delta;
      const minLat = lat - delta;
      const maxLng = lng + delta;
      const maxLat = lat + delta;

      const rawUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;

      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);

      this.isModalOpen = true;

    } catch (error) {
      console.error(error);
      this.mostrarToast(
        'No se pudo acceder al GPS.',
        'danger'
      );
    }
  }

  cerrarMapa() {
    this.audioService.reproducir('click');
    this.isModalOpen = false;
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });

    await toast.present();
  }
}