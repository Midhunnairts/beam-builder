import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  @Output() logIn = new EventEmitter<boolean>();

  constructor(private router: Router,private sharedService: SharedService){

  }
  login(){
    if (this.username == 'admin' && this.password == 'admin123') {
      // this.logIn.emit(true)
      this.sharedService.setLoggedInUsername(this.username);
      this.router.navigate(['/home']);
    } else {
      // this.logIn.emit(false)
    }
  }
}
