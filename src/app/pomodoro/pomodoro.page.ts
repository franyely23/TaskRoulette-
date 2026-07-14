import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.page.html',
  styleUrls: ['./pomodoro.page.scss'],
  standalone: false,
})
export class PomodoroPage {


  tareaActual: string = '';


  // Tiempo temporal de prueba
  // Cambiar después a: 25 * 60
  tiempoInicial: number = 5;


  tiempoRestante: number = this.tiempoInicial;


  intervalo: any;

  corriendo: boolean = false;


  pomodoroTerminado: boolean = false;



  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}



  async ionViewWillEnter() {


  // Reiniciar estado del Pomodoro

  this.pomodoroTerminado = false;

  this.tiempoRestante = this.tiempoInicial;

  this.corriendo = false;

  clearInterval(this.intervalo);



  // Cargar nueva tarea

  const tarea = await this.storageService.get(
    'tarea_pendiente'
  );


  if(tarea){

    this.tareaActual = tarea;

  }


}




  iniciar(){


    if(this.corriendo) return;


    this.corriendo = true;



    this.intervalo = setInterval(()=>{


      if(this.tiempoRestante > 0){


        this.tiempoRestante--;


      }else{


        this.finalizar();


      }


    },1000);



  }




  pausar(){


    this.corriendo = false;


    clearInterval(this.intervalo);


  }





  reiniciar(){


    this.pausar();


    this.tiempoRestante = this.tiempoInicial;


    this.pomodoroTerminado = false;


  }






  finalizar(){


    this.pausar();


    this.tiempoRestante = 0;


    this.pomodoroTerminado = true;


  }






  mostrarTiempo(){


    const minutos = Math.floor(
      this.tiempoRestante / 60
    );


    const segundos =
      this.tiempoRestante % 60;



    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;


  }







  async completarTarea(){



    const tareas = await this.storageService.get(
      'tareas'
    );



    if(tareas){



      const nuevasTareas = tareas.filter(
        (tarea:string)=> tarea !== this.tareaActual
      );



      await this.storageService.set(
        'tareas',
        nuevasTareas
      );



    }




    await this.storageService.remove(
      'tarea_pendiente'
    );



    this.router.navigate([
      '/tabs/tab2'
    ]);



  }

mantenerTarea(){

  this.router.navigate([
    '/tabs/tab3'
  ]);

}


}