import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public AuthService: AuthService) { }

  ngOnInit() {
  }

  login(data: any) { 
    console.log(data);
    this.AuthService.login(data.email, data.password)
  }
}
