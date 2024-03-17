import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { BaseLoad, Beam, DistributedLoad, FixedLoad, MomentLoad, TriangularLoad, support } from './beam.interface'
import { every } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private cdr: ChangeDetectorRef) {

  }
  calculation = 0;
  screen: string = ''
  mainScreen: string = ''
  loggedInUsername: string = '';
  pinSupportPos = true
  pinRollorPos = true
  myBeam: Beam = {
    length: 10,
    support: [
      // { type: 'fixed', position: 0 },
      // { type: 'roller', position: 8 },
      // { type: 'pinned', position: 100 },
      // { type:'hing',position:75}
    ],
    load: [
      // { type: 'pin', value: 40, position: 2, angle: 90 },
      // { type: 'pin', value: 20, position: 10, angle: 90 },
      // { type: 'distributed', value: 10, start: 0, end: 4, position: 0 },
      // { type: 'triangular', start: 4, end: 8, startValue: 20, endValue: 40, position: 4,value:1 },
      // { type: 'moment', value: 3, position: 8 },
    ],
  };

  pinSupport: support = {
    type: 'pinned', position: 0
  }
  fixedSupport: support = {
    type: 'fixed', position: 0
  }
  hingSupport: support = {
    type: 'hing', position: 0
  }
  rollorSupport: support = {
    type: 'roller', position: 0
  }

  momentLoad: MomentLoad = {
    value: 0,
    type: 'moment',
    position: 0
  }

  pinLoad: FixedLoad = {
    value: 0,
    angle: 90,
    type: 'pin',
    position: 0
  }

  distributedLoad: DistributedLoad = {
    value: 0,
    start: 0,
    end: 0,
    type: 'distributed',
    position: 0
  }


  triangulaLoad: TriangularLoad = {
    start: 0,
    end: 0,
    startValue: 0,
    endValue: 0,
    value: 1,
    type: 'triangular',
    position: 0
  }


  addPinnSupport(e: string) {
    if (e == 'left') {
      this.pinSupport.position = 0
    } else if (e == 'right') {
      this.pinSupport.position = this.myBeam.length
    }
  }

  addRollerSupport(e: string) {
    if (e == 'left') {
      this.rollorSupport.position = 0
    } else if (e == 'right') {
      this.rollorSupport.position = this.myBeam.length
    }
  }

  addFixedSupport(e: string) {
    if (e == 'left') {
      this.fixedSupport.position = 0
    } else if (e == 'right') {
      this.fixedSupport.position = this.myBeam.length
    }
  }

  addToSupport(support: support) {
    if (this.myBeam.support.length >= 2) {
      alert("Maximum 2 supports you can add now.")
    } else {

      this.myBeam.support.push(support);
      this.myBeam = structuredClone(this.myBeam)
      if (support.type == 'fixed') {
        this.fixedSupport = {
          type: 'fixed', position: 0
        }
      } else if (support.type == "hing") {
        this.hingSupport = {
          type: 'hing', position: 0
        }
      } else if (support.type == "pinned") {
        this.pinSupport = {
          type: 'pinned', position: 0
        }
        this.pinSupportPos=true
      } else if (support.type == "roller") {
        this.rollorSupport = {
          type: 'roller', position: 0
        }
        this.pinRollorPos = true
      }
    }
  }

  addToLoad(load: FixedLoad | MomentLoad | DistributedLoad | TriangularLoad) {
    if (load.type == 'distributed' || load.type == 'triangular') {
      load.position = (load as DistributedLoad | TriangularLoad).start
    }
    this.myBeam.load.push(load);
    this.myBeam = structuredClone(this.myBeam)
    if (load.type == "pin") {
      this.pinLoad = {
        value: 0,
        angle: 90,
        type: 'pin',
        position: 0
      }
    } else if (load.type == "moment") {
      this.momentLoad = {
        value: 0,
        type: 'moment',
        position: 0
      }
    } else if (load.type == "distributed") {
      this.distributedLoad = {
        value: 0,
        start: 0,
        end: 0,
        type: 'distributed',
        position: 0
      }
    }
    else if (load.type == "triangular") {
      this.triangulaLoad = {
        start: 0,
        end: 0,
        startValue: 0,
        endValue: 0,
        value: 1,
        type: 'triangular',
        position: 0
      }

    }
  }

  reset() {
    this.myBeam = {
      length: 10,
      support: [
      ],
      load: [

      ],
    }
  }
}
