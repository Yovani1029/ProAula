import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'loading',
    pathMatch: 'full',
  },
  {
    path: 'loading',
    loadChildren: () =>
      import('./app/loading/loading.module').then((m) => m.LoadingPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./app/auth/pages/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'factura',
    loadChildren: () =>
      import('./app/auth/pages/factura/factura.module').then(
        (m) => m.FacturaPageModule
      ),
  },
  {
    path: 'registrar-factura',
    loadChildren: () =>
      import(
        './app/auth/pages/factura/registrar-factura/registrar-factura.module'
      ).then((m) => m.RegistrarFacturaPageModule),
  },
  {
    path: 'pagar-factura',
    loadChildren: () =>
      import(
        './app/auth/pages/factura/pagar-factura/pagar-factura.module'
      ).then((m) => m.PagarFacturaPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./app/auth/pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'editar-usuario',
    loadChildren: () =>
      import('./app/auth/pages/editar-usuario/editar-usuario.module').then(
        (m) => m.EditarUsuarioPageModule
      ),
  },

  {
    path: 'transferencia',
    loadChildren: () =>
      import(
        './app/auth/pages/transferencia/transferencia/transferencia.module'
      ).then((m) => m.TransferenciaPageModule),
  },
  {
    path: 'depositar',
    loadChildren: () => import('./app/auth/pages/depositar/depositar.module').then( m => m.DepositarPageModule)
  },
  {
    path: 'soporte',
    loadChildren: () => import('./app/auth/pages/soporte/soporte.module').then( m => m.SoportePageModule)
  },
  {
    path: 'retirar',
    loadChildren: () => import('./app/auth/pages/retirar/retirar.module').then( m => m.RetirarPageModule)
  },
  {
    path: 'solicitudes-soporte',
    loadChildren: () => import('./app/auth/pages/solicitudes-soporte/solicitudes-soporte.module').then( m => m.SolicitudesSoportePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
