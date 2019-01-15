import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  cargando: boolean;
  subscription: Subscription; /// permite llamar el subscribe y destruir la supscriipcion  

  constructor(public AuthService: AuthService, public _store: Store<AppState> ) { }

  ngOnInit() {
    this.subscription = this._store.select('ui').subscribe( ui => {
        this.cargando = ui.isLoading;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login(data: any) { 
    console.log(data);
    this.AuthService.login(data.email, data.password)
  }
}
