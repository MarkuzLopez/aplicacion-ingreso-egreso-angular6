import { NgModule } from '@angular/core';
import {Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { dashboardRoutes } from './dashboard/dashboard.routes';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [ 

    {path: 'login', component: LoginComponent}, 
    {path: 'register', component: RegisterComponent},
    { 
        path: '',
        component: DashboardComponent, 
        children:  dashboardRoutes,   /// pasar el router para el dashboar, collecion de rutas dentro de otras rutas
        canActivate: [ AuthGuardService ] // recibe una coleccion de condicioners , que debe cumplir para poder entrar a la ruta... 
    }, 
    {path: '**', redirectTo: '' }
]


@NgModule({ 
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [ 
        RouterModule
    ]
})

export class AppRoutingModule {}