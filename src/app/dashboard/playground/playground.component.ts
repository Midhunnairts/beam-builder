import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import Konva from 'konva';
import { Beam, DistributedLoad, FixedLoad, MomentLoad, TriangularLoad } from '../beam.interface';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements AfterViewInit {
  @Input() beam!: Beam;
  stage = Konva.Stage
  layer = Konva.Layer
  @ViewChild('konvaContainer') container!: ElementRef;

  ngAfterViewInit() {
    const containerWidth = this.container.nativeElement.offsetWidth;
    const containerHeight = this.container.nativeElement.offsetHeight;
    const ratio = 850 / this.beam.length
    // Create a stage
    const stage = new Konva.Stage({

      container: 'konva-container',
      width: containerWidth,
      height: containerHeight,
      draggable: true
    });

    // Create a layer

    const layer = new Konva.Layer();

    // Draw a horizontal line
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
          layer.add(fixedSupport)

        } else if (support.type == 'hing') {
          const hingSupport = this.createHingSupport(
            (support.position * ratio) + 50,
            100,
            8
          );
          layer.add(hingSupport)

        } else if (support.type == 'roller') {
          const rollerSupport = this.createRollerSupport(
            (support.position * ratio) + 50,
            116,
            6,
            20
          );
          layer.add(rollerSupport)

        } else {
          const pinSupport = this.createPinSupport(
            (support.position * ratio) + 50,
            116,
            12,
            6
          );
          layer.add(pinSupport)

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
          layer.add(pinLoad)

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
            layer.add(distributedLoad)
          }

        } else if (load.type == 'moment') {
          const momentLoad = this.createBendingMoment(
            (load.position * ratio) + 50,
            116,
            20,
          );
          layer.add(momentLoad)

        } else {
          // const triangularLoad = this.createtriangularLoad(
          //   (load.position * ratio) + 50,
          //   100,
          //   200,
          //   40,
          //   5,
          //   40,
          //   5
          // );
          // layer.add(triangularLoad)

        }

      }
    }


    const layerShear = this.createShearAndBendingMoment(ratio);

    layer.add(line);
    stage.add(layer, layerShear);
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




  calculateShearAndBending(sectionPosition: number) {
    // Initialize the reactions at supports
    let Ay = 0;
    let By = 0;

    // Iterate through supports and calculate reactions
    for (const support of this.beam.support) {
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
    for (const load of this.beam.load) {
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
    Ay -= shearForce * sectionPosition / this.beam.length;
    By += shearForce * (1 - sectionPosition / this.beam.length);

    // Calculate bending moment at the specified section
    bendingMoment += Ma * (1 - sectionPosition / this.beam.length) + Mb * sectionPosition / this.beam.length;

    return { shearForce, bendingMoment };
  }


  createShearAndBendingMoment(ratio: number) {
    const layerShear = new Konva.Layer();
    let points = []
    let shearArray=[]
    let bendArray=[]
    const line = new Konva.Line({
      points: [50, 400, 900, 400], // [x1, y1, x2, y2]
      stroke: 'grey',
      strokeWidth: 2,
    });
    const line2 = new Konva.Line({
      points: [50, 800, 900, 800], // [x1, y1, x2, y2]
      stroke: 'grey',
      strokeWidth: 2,
    });
    layerShear.add(line, line2)
    if (this.beam.support) {

      for (const support of this.beam.support) {

        // Create a vertical line shape
        const line = new Konva.Line({
          points: [(support.position * ratio) + 50, 200, (support.position * ratio) + 50, 1200],
          stroke: 'grey', // Set the color
          strokeWidth: 1, // Set the width
        });
        points.unshift(support.position )
        console.log(this.calculateShearAndBending(support.position), points.sort());

        // Add the line to the layer
        layerShear.add(line);

      }
    }
    if (this.beam.load) {

      for (const load of this.beam.load) {

        // Create a vertical line shape
        const line = new Konva.Line({
          points: [(load.position * ratio) + 50, 200, (load.position * ratio) + 50, 1200],
          stroke: 'grey', // Set the color
          strokeWidth: 1, // Set the width
        });
        points.unshift(load.position)

        console.log(this.calculateShearAndBending(load.position), load.position);


        // Add the line to the layer
        layerShear.add(line);

      }
    }
    points=this.bubbleSort(points);
    for (const point of points){
      shearArray.push((point * ratio) + 50,this.calculateShearAndBending(point).shearForce+200)
      let bend=this.calculateShearAndBending(point).bendingMoment
      if(bend>=200){
        bend=200
      }
      bendArray.push((point * ratio) + 50,(-1 * bend)+800)
    }
    const line3 = new Konva.Line({
      points: shearArray,
      stroke: 'black', // Set the color
      strokeWidth: 2, // Set the width
    });
    const line4 = new Konva.Line({
      points: bendArray,
      stroke: 'black', // Set the color
      strokeWidth: 2, // Set the width
    });
    layerShear.add(line3,line4)

    return layerShear;
  }


  bubbleSort(array: number[]): number[] {
    const n = array.length;
    let swapped;

    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        if (array[i] > array[i + 1]) {
          // Swap elements if they are in the wrong order
          const temp = array[i];
          array[i] = array[i + 1];
          array[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);

    return array;
  }
}
