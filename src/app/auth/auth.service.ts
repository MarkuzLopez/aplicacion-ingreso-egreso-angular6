import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import { map } from 'rxjs/operators'
import Swal from 'sweetalert2';
import { User } from './user.model';
///ngrx
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root' /// lo delcara de manbera local, por eso no es necesario que este en el app module
})
export class AuthService {

  private userSubcription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth, private router: Router,
              private firestoreDB: AngularFirestore, private _store: Store<AppState> ) { }

  initAuthListener(){ //// metodo para verificar si los usuarios estan logueados o no y solose ejevcuta uan vez
    this.afAuth.authState.subscribe((fbUser: firebase.User ) => { ///y se agrega en el app.component.ts
       if(fbUser) { // cuando exista el usuario de firebvase este activo el observable
         this.userSubcription =
         this.firestoreDB.doc(`${fbUser.uid}/usuario`).valueChanges()
              .subscribe((usuarioObj: any) => { 
                const newUser =  new User( usuarioObj );
                console.log(newUser);              
                this._store.dispatch(new SetUserAction(newUser) );
              });
       } else  { // si no que cierre la session y que ya no utilize el observable.. 
         this.userSubcription.unsubscribe();
       }
    })
  }

  crearUsuario(nombre: string, email: string, password: string) { 

    //crear el dispatch  y activarlo true
    this._store.dispatch( new ActivarLoadingAction() )

    this.afAuth.auth
                .createUserWithEmailAndPassword(email, password)
                .then( resp => { 
                  //console.log(resp);  
                  const user: User =  { 
                    uid: resp.user.uid,
                    nombre:  nombre,
                    email: resp.user.email
                  }; 

                  this.firestoreDB.doc(`${user.uid}/usuario`)
                      .set( user )
                      .then( () => {                              
                            this.router.navigate(['/'])
                            this._store.dispatch( new DesactivarLoadingAction() ) /// cuando ya se hayya creado o bien se haya logueado de manera satisfactoria desactivarlo..
                      })
                      .catch( error => { 
                        Swal('Error al crear collecion', error.message, 'error')
                      })

                }).catch( error => {                   
                  Swal('Error al crear usuario', error.message, 'error' );
                })
  }

  login(email: string, password: string) { 
    /// crear dispatch para activar el obsevable del store 
    this._store.dispatch(new ActivarLoadingAction() );

    this.afAuth.auth
                .signInWithEmailAndPassword(email, password)
                .then(respuesta  => {                  
                  this.router.navigate([''])
                  this._store.dispatch(new DesactivarLoadingAction() )             
                })
                .catch(error => {                   
                   Swal('Error en el login', error.mesage, 'error')
                   this._store.dispatch(new DesactivarLoadingAction() )
                })
  }

  logOut() { 
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  isAuth() { 
    return this.afAuth.authState
            .pipe(
              map(fbUser => { 
                if(fbUser === null ) { 
                  this.router.navigate(['/login']);
                }

                return fbUser !== null; 

              })
            )
  }

}
