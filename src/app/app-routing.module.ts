import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'departamentos',
    pathMatch: 'full'
  },
  {
    path: 'departamentos',
    loadChildren: () => import('./departamentos/departamentos.module').then(m => m.DepartamentosPageModule),
  },
  {
    path: 'reservaciones',
    loadChildren: () => import('./reservaciones/reservaciones.module').then(m => m.ReservacionesPageModule)
  },
  {
    path: 'crear-visita',
    loadChildren: () => import('./crear-visita/crear-visita.module').then(m => m.CrearVisitaPageModule)
  },
  {
    path: 'add-departamento',
    loadChildren: () => import('./add-departamento/add-departamento.module').then(m => m.AddDepartamentoPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'mi-cuenta',
    loadChildren: () => import('./mi-cuenta/mi-cuenta.module').then(m => m.MiCuentaPageModule)
  },
  {
    path: 'todas-reservaciones',
    loadChildren: () => import('./todas-reservaciones/todas-reservaciones.module').then( m => m.TodasReservacionesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
