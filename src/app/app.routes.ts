import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BreedListComponent } from './components/breed-list/breed-list.component';
import { BreedDetailComponent } from './components/breed-detail/breed-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Razas de perros' },
  { path: 'breeds', component: BreedListComponent, title: 'Razas de perros' },
  { path: 'breeds/:id', component: BreedDetailComponent, title: 'Detalle de raza' },
  { path: '**', redirectTo: '' }
];
