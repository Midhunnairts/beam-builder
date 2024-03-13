import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { Beam, DistributedLoad, FixedLoad, MomentLoad, TriangularLoad } from '../dashboard/beam.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedInUsername: string = '';
  @Input() myBeam: Beam = {
    length: 12,
    support: [
      { type: 'pinned', position: 0 },
      { type: 'pinned', position: 9 }

      // { type: 'roller', position: 25 },
      // { type: 'pinned', position: 100 },
      // { type: 'hing', position: 75 }
    ],
    load: [
      { type: 'pin', value: 45, position: 2, angle: 90 },
      { type: 'distributed', value: 12, start: 0, end: 9, position: 0 },
      { type: 'pin', value: 24, position: 12, angle: 90 },

      // { type: 'triangular', start: 40, end: 80, startValue: 20, endValue: 40, position: 60 },
      // { type: 'moment', value: 200, position: 10 },
    ],
  };;



  constructor(private router: Router, private sharedService: SharedService) {
    const sectionPosition = 25;  // Replace with the desired section position
    const shearForceAtSection = this.calculateShearForce(sectionPosition);
    console.log('Shear force at section at x=0:',this.calculateForcesAndMomentsAtSection(0,this.myBeam));
    console.log('Shear force at section at x=25:',this.calculateForcesAndMomentsAtSection(2,this.myBeam));
    console.log('Shear force at section at x=75:',this.calculateForcesAndMomentsAtSection(9,this.myBeam));
    console.log('Shear force at section at x=100:',this.calculateForcesAndMomentsAtSection(12,this.myBeam));


  }
  ngOnInit() {
    this.sharedService.loggedInUsername$.subscribe(username => {
      this.loggedInUsername = username;
    });
  }
  gotoLogin() {
    this.router.navigate(['/login']);
  }
  calculateShearForce(sectionPosition: number) {
    // Initialize the reactions at supports
    let Ay = 0;
    let By = 0;

    // Iterate through supports and calculate reactions
    for (const support of this.myBeam.support) {
      if (support.type === 'fixed') {
        Ay += 1;  // Replace with the actual calculation for a fixed support
        By += 1;  // Replace with the actual calculation for a fixed support
      } else if (support.type === 'roller') {
        By += 1;  // Replace with the actual calculation for a roller support
      } else if (support.type === 'pinned') {
        Ay += 1;  // Replace with the actual calculation for a pinned support
      } else if (support.type === 'hing') {
        // Replace with the actual calculation for a hinge support
      }
    }

    let shearForce = 0;
    for (const load of this.myBeam.load) {
      if (load.type === 'pin') {
        Ay += (load as FixedLoad).value * Math.sin((load as FixedLoad).angle * (Math.PI / 180));
      } else if (load.type === 'distributed') {
        if (sectionPosition >= (load as DistributedLoad).start && sectionPosition <= (load as DistributedLoad).end) {
          shearForce -= (load as DistributedLoad).value * (sectionPosition - (load as DistributedLoad).start);
        }
      } else if (load.type === 'triangular') {
        if (sectionPosition >= (load as TriangularLoad).start && sectionPosition <= (load as TriangularLoad).end) {
          const triangleHeight = (load as TriangularLoad).endValue - (load as TriangularLoad).startValue;
          const triangleLength = (load as TriangularLoad).end - (load as TriangularLoad).start;
          const x = sectionPosition - (load as TriangularLoad).start;
          shearForce -= ((load as TriangularLoad).startValue + (x / triangleLength) * triangleHeight);
        }
      } else if (load.type === 'moment') {
        shearForce -= (load as MomentLoad).value;
      }
    }

    shearForce += Ay * sectionPosition / this.myBeam.length + By * (1 - sectionPosition / this.myBeam.length);

    return shearForce;
  }

  calculateShearAndBending(sectionPosition:number) {
    // Initialize the reactions at supports
    let Ay = 0;
    let By = 0;

    // Iterate through supports and calculate reactions
    for (const support of this.myBeam.support) {
        if (support.type === 'fixed') {
            Ay += 1;  // Replace with the actual calculation for a fixed support
            By += 1;  // Replace with the actual calculation for a fixed support
        } else if (support.type === 'roller') {
            By += 1;  // Replace with the actual calculation for a roller support
        } else if (support.type === 'pinned') {
            Ay += 1;  // Replace with the actual calculation for a pinned support
        } else if (support.type === 'hing') {
            // Replace with the actual calculation for a hinge support
        }
    }

    // Initialize the moment at supports
    let Ma = 0;
    let Mb = 0;

    // Initialize shear force and bending moment at the specified section
    let shearForce = 0;
    let bendingMoment = 0;

    // Iterate through loads and calculate reactions, shear forces, and bending moments
    for (const load of this.myBeam.load) {
        if (load.type === 'pin') {
            // Calculate reactions due to pin support
            Ay += (load as FixedLoad).value * Math.sin((load as FixedLoad).angle * (Math.PI / 180));
            By += (load as FixedLoad).value * Math.cos((load as FixedLoad).angle * (Math.PI / 180));

            // Calculate shear force due to pin support
            shearForce += (load as FixedLoad).value * Math.sin((load as FixedLoad).angle * (Math.PI / 180));
        } else if (load.type === 'distributed') {
            // Calculate reactions, shear force, and bending moment due to distributed load
            const loadLength = (load as DistributedLoad).end - (load as DistributedLoad).start;
            const loadCenter = ((load as DistributedLoad).start + (load as DistributedLoad).end) / 2;

            const wx = (load as DistributedLoad).value / loadLength;
            const a = (load as DistributedLoad).start;
            const b = (load as DistributedLoad).end;

            Ay += wx * (b - a);
            By += wx * (b - a) * (b + a) / 2;

            if (sectionPosition >= (load as DistributedLoad).start && sectionPosition <= (load as DistributedLoad).end) {
                shearForce -= wx * (sectionPosition - a);
                bendingMoment -= wx * Math.pow(sectionPosition - loadCenter, 2) / 2;
            }
        } else if (load.type === 'triangular') {
            // Calculate reactions, shear force, and bending moment due to triangular load
            const loadLength = (load as TriangularLoad).end - (load as TriangularLoad).start;
            const loadCenter = ((load as TriangularLoad).start + (load as TriangularLoad).end) / 2;

            const wa = ((load as TriangularLoad).endValue - (load as TriangularLoad).startValue) / loadLength;
            const a = (load as TriangularLoad).start;
            const b = (load as TriangularLoad).end;

            Ay += wa * (b - a) / 2;
            By += wa * (b - a) * (b + a) / 4;

            if (sectionPosition >= (load as TriangularLoad).start && sectionPosition <= (load as TriangularLoad).end) {
                const x = sectionPosition - (load as TriangularLoad).start;
                shearForce -= wa * x;
                bendingMoment -= wa * Math.pow(x, 2) / 2;
            }
        } else if (load.type === 'moment') {
            // Calculate reactions and bending moment due to applied moment
            Ma -= (load as MomentLoad).value;
            Mb += (load as MomentLoad).value;

            // Calculate bending moment at the specified section
            if (sectionPosition <= load.position) {
                bendingMoment -= (load as MomentLoad).value * (sectionPosition - load.position);
            }
        }
    }

    // Calculate reactions at the specified section
    Ay -= shearForce * sectionPosition / this.myBeam.length;
    By += shearForce * (1 - sectionPosition / this.myBeam.length);

    // Calculate bending moment at the specified section
    bendingMoment += Ma * (1 - sectionPosition / this.myBeam.length) + Mb * sectionPosition / this.myBeam.length;

    return { shearForce, bendingMoment };
}
calculateForcesAndMomentsAtSection(sectionPosition:number, beam:Beam) {
  let Ay = 0;
  let By = 0;
  let Ma = 0;
  let Mb = 0;

  // Iterate through supports and calculate reactions
  for (const support of beam.support) {
      if (support.type === 'fixed') {
          Ay += 1;  // Replace with the actual calculation for a fixed support
          By += 1;  // Replace with the actual calculation for a fixed support
      } else if (support.type === 'roller') {
          By += 1;  // Replace with the actual calculation for a roller support
      } else if (support.type === 'pinned') {
          Ay += 1;  // Replace with the actual calculation for a pinned support
      } else if (support.type === 'hing') {
          // Replace with the actual calculation for a hinge support
      }
  }

  // Iterate through loads and calculate forces and moments
  for (const load of beam.load) {
      if (load.type === 'pin') {
          Ay += (load as FixedLoad).value * Math.sin((load as FixedLoad).angle * (Math.PI / 180));
          // Calculate moment due to pin support
          Ma -= (load as FixedLoad).value * Math.cos((load as FixedLoad).angle * (Math.PI / 180)) * (sectionPosition - load.position);
      } else if (load.type === 'distributed') {
          // Calculate shear force due to distributed load
          if (sectionPosition >= (load as DistributedLoad).start && sectionPosition <= (load as DistributedLoad).end) {
              Ay -= (load as DistributedLoad).value * (sectionPosition - (load as DistributedLoad).start);
          }
          // Calculate moment due to distributed (load as DistributedLoad)
          if (sectionPosition >= (load as DistributedLoad).start && sectionPosition <= (load as DistributedLoad).end) {
              const x = sectionPosition - (load as DistributedLoad).start;
              Mb -= (load as DistributedLoad).value * x * (sectionPosition - (load as DistributedLoad).start) / 2;
          }
      } else if (load.type === 'triangular') {
          // Calculate shear force due to triangular load
          if (sectionPosition >= (load as TriangularLoad).start && sectionPosition <= (load as TriangularLoad).end) {
              const triangleHeight = (load as TriangularLoad).endValue - (load as TriangularLoad).startValue;
              const triangleLength = (load as TriangularLoad).end - (load as TriangularLoad).start;
              const x = sectionPosition - (load as TriangularLoad).start;
              Ay -= ((load as TriangularLoad).startValue + (x / triangleLength) * triangleHeight);
          }
          // Calculate moment due to triangular (load as TriangularLoad)
          if (sectionPosition >= (load as TriangularLoad).start && sectionPosition <= (load as TriangularLoad).end) {
            const triangleHeight = (load as TriangularLoad).endValue - (load as TriangularLoad).startValue;
              const triangleLength = (load as TriangularLoad).end - (load as TriangularLoad).start;
              const x = sectionPosition - (load as TriangularLoad).start;
              const loadValue = (load as TriangularLoad).startValue + (x / triangleLength) * triangleHeight;
              Ma -= loadValue * x;
          }
      } else if (load.type === 'moment') {
          // Calculate shear force due to applied moment
          Ay -= (load as MomentLoad).value;
          // Calculate moment due to applied moment
          Ma -= (load as MomentLoad).value;
      }
  }

  // Calculate shear force and bending moment at the specified section
  const shearForce = Ay * sectionPosition / beam.length + By * (1 - sectionPosition / beam.length);
  const bendingMoment = Ma + Mb;

  return { shearForce, bendingMoment };
}
}