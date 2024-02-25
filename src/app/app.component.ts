import { Component, OnInit } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'beam-builder';
  loggedInUsername : string = '';
  constructor(private sharedService: SharedService){

  }
  ngOnInit() {
    this.sharedService.loggedInUsername$.subscribe(username => {
      this.loggedInUsername = username;
    });
  }
}
