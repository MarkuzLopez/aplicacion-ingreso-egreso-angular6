import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import { map } from 'rxjs/operators'
import Swal from 'sweetalert2';
import { User } from './user.model';


@Injectable({
  providedIn: 'root' /// lo delcara de manbera local, por eso no es necesario que este en el app module
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private firestoreDB: AngularFirestore ) { }

  initAuthListener(){ //// metodo para verificar si los usuarios estan logueados o no y solose ejevcuta uan vez
    this.afAuth.authState.subscribe((fbUser: firebase.User ) => { ///y se agrega en el app.component.ts
      console.log(fbUser);      
    })
  }

  crearUsuario(nombre: string, email: string, password: string) { 
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
                      })
                      .catch( error => { 
                        Swal('Error al crear collecion', error.message, 'error')
                      })

                }).catch( error => {                   
                  Swal('Error al crear usuario', error.message, 'error' );
                })
  }

  login(email: string, password: string) { 
    this.afAuth.auth
                .signInWithEmailAndPassword(email, password)
                .then(respuesta  => {                  
                  this.router.navigate([''])                  
                })
                .catch(error => {                   
                   Swal('Error en el login', error.mesage, 'error')
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
