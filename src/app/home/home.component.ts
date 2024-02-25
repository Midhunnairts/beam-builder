import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedInUsername : string = '';
  constructor(private sharedService: SharedService){

  }
  ngOnInit() {
    this.sharedService.loggedInUsername$.subscribe(username => {
      this.loggedInUsername = username;
    });
  }
}