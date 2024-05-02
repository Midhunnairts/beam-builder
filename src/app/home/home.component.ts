import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { Beam } from '../dashboard/beam.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loggedInUsername: string = '';

  constructor(private router: Router, private sharedService: SharedService) {}
  ngOnInit() {
    this.sharedService.loggedInUsername$.subscribe((username) => {
      this.loggedInUsername = username;
    });
  }
  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
