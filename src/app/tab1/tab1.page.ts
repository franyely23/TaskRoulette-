import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from '../services/storage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  nombreUsuario: string = '';
  // Usamos una imagen por defecto o vacío
  fotoPerfil: string | undefined = ''; 

  constructor(
    private storageService: StorageService,
    private toastController: ToastController
  ) {}

  async ionViewWillEnter() {
    // Cuando entra a la pantalla, cargamos el "login" si ya existe en el storage local
    const nombreGuardado = await this.storageService.get('nombre_usuario');
    const fotoGuardada = await this.storageService.get('foto_perfil');

    if (nombreGuardado) {
      this.nombreUsuario = nombreGuardado;
    }
    
    if (fotoGuardada) {
      this.fotoPerfil = fotoGuardada;
    }
  }

  // --- REQUISITO: USO DE HARDWARE (CÁMARA) ---
  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl, // DataUrl nos permite mostrarla directo en el HTML
        source: CameraSource.Camera // Fuerza a abrir la cámara nativa del dispositivo
      });

      // Guardamos la imagen en la variable temporal para que se muestre en pantalla
      this.fotoPerfil = image.dataUrl;
    } catch (error) {
      console.error('Error al abrir la cámara', error);
      // Nota: Si el usuario cancela o cierra la cámara, caerá en este bloque catch
    }
  }

  async guardarPerfil() {
    // Validación básica para que no guarde el nombre en blanco
    if (!this.nombreUsuario || !this.nombreUsuario.trim()) {
      this.mostrarToast('Por favor ingresa un nombre de usuario', 'warning');
      return;
    }

    // Guardamos los datos simulando el "Login / Registro"
    await this.storageService.set('nombre_usuario', this.nombreUsuario.trim());
    
    if (this.fotoPerfil) {
      await this.storageService.set('foto_perfil', this.fotoPerfil);
    }

    this.mostrarToast('¡Perfil guardado con éxito!', 'success');
  }

  // Función auxiliar para mostrar notificaciones bonitas en pantalla
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