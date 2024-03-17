import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import Konva from 'konva';
import { Beam, DistributedLoad, FixedLoad, MomentLoad, TriangularLoad } from '../beam.interface';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements AfterViewInit, OnChanges {
  @Input() beam!: Beam;
  @Input() calculation:number=0
  private stage !: Konva.Stage
  private layer !: Konva.Layer
  @ViewChild('konvaContainer') container!: ElementRef;
  ngOnChanges(changes: SimpleChanges): void {
    if(this.stage){

      this.stage.removeChildren()     
    }
    setTimeout(() => {
      const ratio = 850 / this.beam.length
      this.layer = new Konva.Layer();

      // Draw a horizontal line
  
  
      // const layerShear = this.createShearAndBendingMoment(ratio);
  
  
      this.stage.add(this.layer);
      const line = new Konva.Line({
        points: [50, 100, 900, 100], // [x1, y1, x2, y2]
        stroke: 'black',
        strokeWidth: 2,
      });
      if (this.beam.support) {

        for (const support of this.beam.support) {
          if (support.type == 'fixed') {
            const fixedSupport = this.createFixedSupport(
              (support.position * ratio) + 50,
              70,
            );
            this.layer.add(fixedSupport)

          } else if (support.type == 'hing') {
            const hingSupport = this.createHingSupport(
              (support.position * ratio) + 50,
              100,
              8
            );
            this.layer.add(hingSupport)

          } else if (support.type == 'roller') {
            const rollerSupport = this.createRollerSupport(
              (support.position * ratio) + 50,
              116,
              6,
              20
            );
            this.layer.add(rollerSupport)

          } else {
            const pinSupport = this.createPinSupport(
              (support.position * ratio) + 50,
              116,
              12,
              6
            );
            this.layer.add(pinSupport)

          }

        }
      }
      if (this.beam.load) {

        for (const load of this.beam.load) {
          if (load.type == 'pin') {
            const pinLoad = this.createPinLoad(
              (load.position * ratio) + 50,
              100,
              40
            );
            this.layer.add(pinLoad)

          } else if (load.type == 'distributed') {
            if ('start' in load && 'end' in load) {
              const distributedLoad = this.createDistributedLoad(
                (load.position * ratio) + 50,
                80,
                (load.end - load.start) * ratio,
                200 / 40,
                20,
                5
              );
              this.layer.add(distributedLoad)
            }

          } else if (load.type == 'moment') {
            const momentLoad = this.createBendingMoment(
              (load.position * ratio) + 50,
              116,
              20,
            );
            this.layer.add(momentLoad)

          } else {
            const triangularLoad = this.createtriangularLoad(
              (load.position * ratio) + 50,
              100,
              200,
              40,
              5,
              40,
              5
            );
            this.layer.add(triangularLoad)

          }


        }
        this.layer.add(line);
        this.layer.batchDraw()
      }
    })
    if (changes["calculation"]&&this.calculation!=0){ 
      const ratio = 850 / this.beam.length
      let shear = this.calcShear()
      const layerShear = this.drawShearForce(shear.forces, ratio)
      const layerMoment = this.drawMomentForce(shear.moments, ratio)
      this.stage.add( layerShear, layerMoment);
      this.stage.batchDraw()
    }
  }
  ngAfterViewInit() {
    const containerWidth = this.container.nativeElement.offsetWidth;
    const containerHeight = this.container.nativeElement.offsetHeight;
    const ratio = 850 / this.beam.length
    // Create a stage
    this.stage = new Konva.Stage({

      container: 'konva-container',
      width: containerWidth,
      height: containerHeight,
      draggable: true
    });

    // Create a layer

  }

  private createFixedSupport(x: number, y: number): Konva.Line {
    // Draw the vertical line
    const line = new Konva.Line({
      points: [x, y, x, y + 60],
      stroke: 'black',
      strokeWidth: 2,
    });

    return line;
  }


  private createHingSupport(x: number, y: number, radius: number): Konva.Circle {
    // Create a circle to represent the roller support
    const roller = new Konva.Circle({
      x,
      y,
      radius,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
      draggable: false, // Set to true if you want to make the support draggable
    });

    return roller;
  }

  private createRollerSupport(x: number, y: number, circleRadius: number, lineLength: number): Konva.Group {
    // Create a circle to represent the roller support
    // Create a group to hold the roller support elements
    const group = new Konva.Group({
      x,
      y,
      draggable: false, // Set to true if you want to make the support draggable
    });

    // Create the top circle
    const topCircle = new Konva.Circle({
      x: 0,
      y: -lineLength / 2,
      radius: circleRadius,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
    });

    // Create the bottom circle
    const bottomCircle = new Konva.Circle({
      x: 0,
      y: lineLength / 2,
      radius: circleRadius,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
    });

    // Create the vertical line connecting the circles
    const line = new Konva.Line({
      points: [0, -lineLength / 2, 0, lineLength / 2],
      stroke: 'black',
      strokeWidth: 2,
    });

    // Add elements to the group
    group.add(topCircle, bottomCircle, line);

    return group;
  }

  private createPinSupport(x: number, y: number, triangleSize: number, circleRadius: number): Konva.Group {
    // Create a group to hold the pin support elements
    const group = new Konva.Group({
      x,
      y,
      draggable: false, // Set to true if you want to make the support draggable
    });

    // Create the upper triangle
    const upperTriangle = new Konva.RegularPolygon({
      sides: 3,
      radius: triangleSize,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 2,
    });

    // Create the small circle in the middle
    const circle = new Konva.Circle({
      radius: circleRadius,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 2,
    });

    // Add elements to the group
    group.add(upperTriangle, circle);

    return group;
  }


  private createPinLoad(x: number, y: number, size: number): Konva.Arrow {
    // Create an arrow shape to represent the pin support
    const arrow = new Konva.Arrow({
      points: [x, y - size, x, y],
      pointerLength: 10,
      pointerWidth: 10,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 2,
      draggable: false, // Set to true if you want to make the support draggable
    });

    return arrow;
  }

  private createDistributedLoad(x: number, y: number, length: number, numberOfArrows: number, arrowHeight: number, arrowWidth: number): Konva.Group {
    // Create a group to hold the distributed load elements
    const group = new Konva.Group({
      x,
      y,
      draggable: false,
    });

    // Draw the horizontal line
    const line = new Konva.Line({
      points: [0, 0, length, 0],
      stroke: 'black',
      strokeWidth: 2,
    });

    // Calculate the spacing between arrows
    const spacing = length / (numberOfArrows - 1);

    // Draw vertical arrows
    for (let i = 0; i < numberOfArrows; i++) {
      const arrow = new Konva.Arrow({
        points: [i * spacing, 0, i * spacing, arrowHeight],
        stroke: 'black',
        fill: 'black',
        strokeWidth: 2,
        pointerLength: arrowWidth,
        // pointerWidth: arrowHeight,
      });

      group.add(arrow);
    }

    // Add the horizontal line to the group
    group.add(line);

    return group;
  }


  private createtriangularLoad(x: number, y: number, base: number, height: number, numberOfArrows: number, arrowHeight: number, arrowWidth: number): Konva.Shape {
    // Create a right-angled triangle to represent the bending moment
    const triangle = new Konva.Shape({
      sceneFunc: (context, shape) => {
        context.beginPath();
        context.moveTo(x - base / 2, y + height / 2);
        context.lineTo(x + base / 2, y + height / 2);
        context.lineTo(x - base / 2, y - height / 2);
        context.closePath();
        context.fillStrokeShape(shape);
      },
      fill: 'gray',
      stroke: 'black',
      strokeWidth: 2,
      draggable: false,
    });

    return triangle;
  }


  private createBendingMoment(x: number, y: number, radius: number): Konva.Group {
    // Create a group to hold the bending moment elements
    const group = new Konva.Group({
      x,
      y,
      draggable: false,
    });

    // Draw a thin arc to represent the bending moment
    const arc = new Konva.Arc({
      x: 0,
      y: -18,
      innerRadius: radius,
      outerRadius: radius,
      angle: 270,
      fill: 'black',
      stroke: 'black',
      // strokeWidth: 2,
      rotation: -90,
    });

    // Draw an arrowhead at the end of the arc
    const arrowhead = new Konva.RegularPolygon({
      x: -radius + 16,
      y: -36,
      sides: 3, // Triangle
      radius: 10,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 2,
      rotation: -100,
    });


    // Add the arc and arrowhead to the group
    group.add(arc, arrowhead);

    return group;
  }

  calcShear() {
    let ra = 0
    let rb = 0
    let sumLoad = 0
    let sload = 0
    for (const l of this.beam.load) {
      if (l.type == 'pin' || l.type == 'moment') {
        sumLoad = sumLoad + (l.position * ((l as FixedLoad).value));
        sload = sload + (l as FixedLoad).value
      }
      else if (l.type == 'distributed') {
        let diff = (l as DistributedLoad).end - (l as DistributedLoad).start

        sumLoad = sumLoad + ((diff * (l as DistributedLoad).value) * ((diff / 2) + (l as DistributedLoad).start))
        sload = sload + (diff * (l as DistributedLoad).value)
      } else if (l.type == 'triangular') {
        let diff = (l as TriangularLoad).end - (l as TriangularLoad).start
        let hdiff = (l as TriangularLoad).endValue - (l as TriangularLoad).startValue
        let tValue = (2 * diff) / 3
        let tarea = diff * hdiff / 2
        let rarea = (l as TriangularLoad).startValue * diff
        sumLoad = sumLoad + ((tarea + rarea) * (tValue + (l as TriangularLoad).start))
        sload = sload + ((tarea + rarea) * diff)
      }
    }
    rb = sumLoad / this.beam.length
    ra = sload - (sumLoad / this.beam.length)

    let common: any[] = []
    for (const s of this.beam.support) {
      common.push(s)
    }
    for (const l of this.beam.load) {
      common.push(l)
    }
    let forces = []
    common.sort((a, b) => a.position - b.position);
    console.log(common);

    let prevValue;
    for (const c of common) {
      if (!c.value) {
        if (!prevValue) {
          const obj = {
            position: c.position,
            force: Math.abs(ra),
            type: c.type
          }
          forces.push(
            obj
          )
          prevValue = obj
        }
        else {
          let obj: { position: number, force: number, type: string } = {
            position: 0,
            force: 0,
            type: ''
          };

          obj = {
            position: c.position,
            force: prevValue.force,
            type: c.type
          }
          forces.push(
            obj
          )
          prevValue = obj

        }
      }
      else {
        if (prevValue) {
          let obj: { position: number, force: number, type: string } = {
            position: 0,
            force: 0,
            type: ''
          };

          if (c.type == 'distributed') {

            obj = {
              position: c.position,
              force: prevValue.force - (c.value * (c.end - c.start)),
              type: c.type
            }
          } else if (c.type == 'triangular') {
            let diff = (c as TriangularLoad).end - (c as TriangularLoad).start
            let hdiff = (c as TriangularLoad).endValue - (c as TriangularLoad).startValue
            let tValue = (2 * diff) / 3
            let tarea = diff * hdiff / 2
            let rarea = (c as TriangularLoad).startValue * diff

            obj = {
              position: c.position,
              force: prevValue.force - ((tarea + rarea) * diff),
              type: c.type
            }
          } else {

            obj = {
              position: c.position,
              force: prevValue.force - c.value,
              type: c.type
            }
          }

          forces.push(
            obj
          )
          prevValue = obj
        }
      }
    }
    let moments = []
    let preCommon
    console.log(common);

    for (const c of common) {
      if (c.position == 0 || c.position == this.beam.length) {
        let o = {
          position: c.position,
          moment: 0,
          type: c.type
        }
        moments.push(o);
      }
      else {
        if (preCommon) {

          let mom = 0
          if (preCommon.value) {
            if (preCommon.type == 'distributed') {
              mom = (ra * c.position) - ((preCommon.value * (preCommon.end - preCommon.start)) * (c.position - preCommon.position))
            } else if (preCommon.type == 'triangular') {
              let diff = (preCommon as TriangularLoad).end - (preCommon as TriangularLoad).start
              let hdiff = (preCommon as TriangularLoad).endValue - (preCommon as TriangularLoad).startValue
              let tValue = (2 * diff) / 3
              let tarea = diff * hdiff / 2
              let rarea = (preCommon as TriangularLoad).startValue * diff
              mom = (ra * c.position) - (((tarea + rarea) * diff) * tValue)
            } else {
              mom = (ra * c.position) - (preCommon.value * (c.position - preCommon.position))
            }
          } else {
            mom = ra * c.position
          }
          let o = {
            position: c.position,
            moment: mom,
            type: c.type
          }
          moments.push(o);
        }
      }
      preCommon = c
    }

    console.log(forces);
    

    return { forces, moments }
  }

  drawShearForce(shear: any, ratio: number) {
    const layerShear = new Konva.Layer();
    let points = []
    let shearArray = []
    let bendArray = []
    const line = new Konva.Line({
      points: [50, 400, 900, 400], // [x1, y1, x2, y2]
      stroke: 'grey',
      strokeWidth: 2,
    });

    layerShear.add(line)
    let dRatio = 1
    for (const s of shear) {
      if (s.force < 10) {
        dRatio = 10
      } else {
        dRatio = 1
        break;
      }
    }

    for (let i = 0; i < shear.length - 1; i++) {

      const sh = shear[i]
      const nsh = shear[i + 1]

      if (sh.type == 'fixed' || sh.type == 'pinned' || sh.type == 'hing' || sh.type == 'roller') {
        shearArray.push(50 + (sh.position * ratio), 400 - (sh.force * dRatio))
        shearArray.push(50 + (nsh.position * ratio), 400 - (sh.force * dRatio))
        console.log(shearArray,1);
        
      }
      else if (sh.type == 'pin' || sh.type == 'moment') {
        shearArray.push(50 + (sh.position * ratio), 400 - (sh.force * dRatio))
        shearArray.push(50 + (nsh.position * ratio), 400 - (sh.force * dRatio))
      }
      else if (sh.type == 'distributed') {
        let psh = shear[i - 1]
        shearArray.push(50 + (sh.position * ratio), 400 - (psh.force * dRatio))
        shearArray.push(50 + (nsh.position * ratio), 400 - (nsh.force * dRatio))
      } else if (sh.type == 'triangular') {
        let psh = shear[i - 1]
        shearArray.push(50 + (sh.position * ratio), 400 - (psh.force * dRatio))
        shearArray.push(50 + (nsh.position * ratio), 400 - (nsh.force * dRatio))
      }
      const line = new Konva.Line({
        points: [(sh.position * ratio) + 50, 200, (sh.position * ratio) + 50, 1600],
        stroke: 'grey', // Set the color
        strokeWidth: 1, // Set the width
      });
console.log(shearArray);

      // Add the line to the layer
      layerShear.add(line);


    }
    shearArray.push(50 + (this.beam.length * ratio), 400)
    const last = new Konva.Line({
      points: [900, 200, 900, 1600],
      stroke: 'grey', // Set the color
      strokeWidth: 1, // Set the width
    });


    const line3 = new Konva.Line({
      points: shearArray,
      stroke: 'black', // Set the color
      strokeWidth: 2, // Set the width
    });

    layerShear.add(line3, last)

    return layerShear;
  }


  drawMomentForce(Moment: any, ratio: number) {
    const layerMoment = new Konva.Layer();
    let MomentArray = []
    const line = new Konva.Line({
      points: [50, 800, 900, 800], // [x1, y1, x2, y2]
      stroke: 'grey',
      strokeWidth: 2,
    });

    layerMoment.add(line)
    let dRatio = 1
    for (const s of Moment) {
      if (s.force < 10) {
        dRatio = 10
      } else {
        dRatio = 1
        break;
      }
    }

    for (let i = 0; i < Moment.length; i++) {

      const sh = Moment[i]

      MomentArray.push(50 + (sh.position * ratio), 800 - (sh.moment * dRatio))

      const line = new Konva.Line({
        points: [(sh.position * ratio) + 50, 200, (sh.position * ratio) + 50, 800],
        stroke: 'grey', // Set the color
        strokeWidth: 1, // Set the width
      });

      // Add the line to the layer
      layerMoment.add(line);


    }
    MomentArray.push(50 + (this.beam.length * ratio), 800)

    const last = new Konva.Line({
      points: [900, 200, 900, 800],
      stroke: 'grey', // Set the color
      strokeWidth: 1, // Set the width
    });


    const line3 = new Konva.Line({
      points: MomentArray,
      stroke: 'black', // Set the color
      strokeWidth: 2, // Set the width
    });

    layerMoment.add(line3, last)

    return layerMoment;
  }
}
