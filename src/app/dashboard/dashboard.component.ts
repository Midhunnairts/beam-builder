import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Beam, support } from './beam.interface'
import { every } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  screen: string = ''
  mainScreen: string = ''
  loggedInUsername: string = '';
  pinSupportPos=true
  pinRollorPos=true
  myBeam: Beam = {
    length: 10,
    support: [
      // { type: 'fixed', position: 0 },
      // { type: 'fixed', position: 10 },
      // { type: 'pinned', position: 100 },
      // { type:'hing',position:75}
    ],
    load: [
      // { type: 'pin', value: 2, position: 2, angle: 90 },
      // { type: 'pin', value: 5, position: 6, angle: 90 },
      // { type: 'distributed', value: 5, start: 3, end: 6, position: 3 },
      // { type: 'triangular', start: 4, end: 8, startValue: 2, endValue: 4, position: 4,value:1 },
      // { type: 'moment', value: 3, position: 8 },
    ],
  };

  pinSupport : support={
    type: 'pinned', position: 0 
  }
  fixedSupport : support={
    type: 'fixed', position: 0 
  }
  hingSupport : support={
    type: 'hing', position: 0 
  }
  rollorSupport : support={
    type: 'roller', position: 0 
  }


  addPinnSupport(e:string){
    if(e=='left'){
      this.pinSupport.position=0
    } else if(e=='right'){
      this.pinSupport.position=this.myBeam.length
    }    
  }

  addRollerSupport(e:string){
    if(e=='left'){
      this.rollorSupport.position=0
    } else if(e=='right'){
      this.rollorSupport.position=this.myBeam.length
    }    
  }

  addFixedSupport(e:string){
    if(e=='left'){
      this.fixedSupport.position=0
    } else if(e=='right'){
      this.fixedSupport.position=this.myBeam.length
    }    
  }

  addToSupport(support:support){
    this.myBeam.support.push(support);
    console.log(this.myBeam);
    
  }
}
