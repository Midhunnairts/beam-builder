import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import Konva from 'konva';
import { Beam } from '../beam.interface';

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
      console.log(this.beam.support,ratio);

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
   

    const grp = new Konva.Group()
    const gline = new Konva.Line({
      points: [50, 200, 350, 200], // [x1, y1, x2, y2]
      stroke: 'black',
      strokeWidth: 2,
    });
    const arrow1 = this.createArrow(50, 200, 50, 250);
    const arrow2 = this.createArrow(150, 200, 150, 250);
    const arrow3 = this.createArrow(250, 200, 250, 250);
    const arrow4 = this.createArrow(350, 200, 350, 250);
    grp.add(gline, arrow1, arrow2, arrow3, arrow4)
    layer.add(line);
    const distributedLoad = this.createDistributedLoad(
      stage.width() / 2,
       stage.height() / 2,
      100,
       20,
    ); 
layer.add(distributedLoad)

    // Add the layer to the stage
    stage.add(layer);
  }
  private createArrow(x1: number, y1: number, x2: number, y2: number): Konva.Line {
    // Calculate arrowhead points
    const arrowheadSize = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowheadX = x2 - arrowheadSize * Math.cos(angle - Math.PI / 6);
    const arrowheadY = y2 - arrowheadSize * Math.sin(angle - Math.PI / 6);

    // Create a line with arrowhead
    const arrow = new Konva.Line({
      points: [x1, y1, x2, y2, arrowheadX, arrowheadY, x2, y2],
      stroke: 'black',
      strokeWidth: 2,
      closed: true, // Close the shape to make it a filled arrowhead
      fill: 'black',
    });

    return arrow;
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

  private createRollerSupport(x: number, y: number, circleRadius: number,lineLength:number): Konva.Group {
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

  private createPinSupport( x:number, y:number, triangleSize:number, circleRadius:number ): Konva.Group {
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


  private createDistributedLoad( x:number, y:number, width:number, height:number): Konva.Shape {
    // Create a trapezoidal shape to represent the distributed load
    const trapezoid = new Konva.Shape({
      sceneFunc: (context, shape) => {
        context.beginPath();
        context.moveTo(x - width / 2, y);
        context.lineTo(x + width / 2, y);
        context.lineTo(x + width / 4, y - height);
        context.lineTo(x - width / 4, y - height);
        context.closePath();
        context.fillStrokeShape(shape);
      },
      fill: 'gray',
      stroke: 'black',
      strokeWidth: 2,
      draggable: false, // Set to true if you want to make the load draggable
    });

    return trapezoid;
  }
}
