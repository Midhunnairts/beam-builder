import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Beam } from './beam.interface'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  screen: string = ''
  mainScreen: string = ''
  loggedInUsername: string = '';
  myBeam: Beam = {
    length: 10,
    support: [
      { type: 'fixed', position: 0 },
      { type: 'fixed', position: 10 },
      // { type: 'pinned', position: 100 },
      // { type:'hing',position:75}
    ],
    load: [
      { type: 'pin', value: 2, position: 2, angle: 90 },
      { type: 'pin', value: 5, position: 6, angle: 90 },
      // { type: 'distributed', value: 5, start: 3, end: 6, position: 3 },
      // { type: 'triangular', start: 4, end: 8, startValue: 2, endValue: 4, position: 4,value:1 },
      // { type: 'moment', value: 3, position: 8 },
    ],
  };
  constructor(private sharedService: SharedService) {

  }
  ngOnInit() {
    this.sharedService.loggedInUsername$.subscribe(username => {
      this.loggedInUsername = username;
    });
  }
}
