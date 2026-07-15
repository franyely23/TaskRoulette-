import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // <- ESTO ES LO QUE QUITA EL ERROR DEL ION-ICON
import { FormsModule } from '@angular/forms'; // <- ESTO EVITA OTRO ERROR CON EL NGMODEL
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // <- DEBE ESTAR AQUÍ ADENTRO
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}