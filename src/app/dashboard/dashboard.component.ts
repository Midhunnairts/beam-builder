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
    length: 100,
    support: [
      { type: 'fixed', position: 0 },
      { type: 'roller', position: 25 },
      { type: 'pinned', position: 100 },
      { type:'hing',position:75}
    ],
    load: [
      { type: 'pin', value: 100, position: 30, angle: 90 },
      { type: 'distributed', value: 50, start: 40, end: 70, position: 40 },
      { type: 'triangular', start: 40, end: 80, startValue: 20, endValue: 40, position: 40 },
      { type: 'moment', value: 200, position: 10 },
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
