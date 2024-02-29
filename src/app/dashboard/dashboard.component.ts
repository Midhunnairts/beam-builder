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
      // { type: 'roller', position: 5 },
      // { type: 'pinned', position: 10 },
    ],
    load: [
      // { type: 'fixed', value: 100, position: 2, angle: 90 },
      { type: 'distributed', value: 50, start: 3, end: 7, position: 4 },
      // { type: 'triangular', start: 4, end: 8, startValue: 20, endValue: 40, position: 6 },
      // { type: 'moment', value: 200, position: 9 },
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
