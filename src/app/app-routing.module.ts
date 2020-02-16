import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { AppCustomPreloader } from './app-preload.module';
// tslint:disable: max-line-length
// tslint:disable: quotemark

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: 'src/app/components/login/login.module#LoginModule' },

  { path: 'register/:email/:token', loadChildren: 'src/app/components/register/register.module#RegisterModule' },

  { path: 'home', loadChildren: 'src/app/components/home/home.module#HomeModule', canActivate: [AuthGuard], data: { preload: true } },

  { path: '**', loadChildren: 'src/app/components/notFound/notFound.module#NotFoundModule' }

];

@NgModule({
  imports: [
            RouterModule.forRoot(routes, { preloadingStrategy: AppCustomPreloader }),
            ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
