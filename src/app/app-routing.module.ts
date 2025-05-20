import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'loading',
    pathMatch: 'full'
  },
  {
    path: 'loading',
    loadChildren: () =>
      import('./app/loading/loading.module').then(m => m.LoadingPageModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./app/auth/pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./app/auth/pages/register/register.module').then(m => m.RegisterPageModule)
<<<<<<< HEAD
=======
  },
  {
    path: 'transferencia',
    loadChildren: () => import('./app/auth/pages/transferencia/transferencia/transferencia.module').then( m => m.TransferenciaPageModule)
>>>>>>> 6a04252 (nuevo commit)
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
