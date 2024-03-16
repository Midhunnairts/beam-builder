import { Component } from '@angular/core';

@Component({
  selector: 'app-concrete',
  templateUrl: './concrete.component.html',
  styleUrls: ['./concrete.component.scss'],
})
export class ConcreteComponent {
  beamLength: string = '350';
  effectiveCover: string = '50';
  beamDepth: string = '650';
  bendingMoment: string = '185000';
  sigmaCBC: string = '7';
  sigmaST: string = '230';
  noOfBars: string = '20';
  k: string = '';
  m: string = '';
  j: string = '';
  r: string = '';
  n: string = '';
  mOne: string = '';
  mTwo: string = '';
  aSTOne: string = '';
  aSTTwo: string = '';
  aST: string = '';
  aPhi: string = '';
  barsRequired: string = '';
  aSC: string = '';
  totalNoOfBars: string = '';

  calculateM() {
    const mValue = 280 / (3 * parseFloat(this.sigmaCBC));
    this.m = mValue.toFixed(2);
  }

  calculateK() {
    const kValue =
      (parseFloat(this.m) * parseFloat(this.sigmaCBC)) /
      (parseFloat(this.m) * parseFloat(this.sigmaCBC) + 230);
    this.k = kValue.toFixed(2);
  }

  calculateJ() {
    const jValue = 1 - parseFloat(this.k) / 3;
    this.j = jValue.toFixed(2);
  }

  calculateR() {
    const rValue =
      0.5 * parseFloat(this.sigmaCBC) * parseFloat(this.k) * parseFloat(this.j);
    this.r = rValue.toFixed(2);
  }

  calculateN() {
    const nValue = parseFloat(this.k) * parseFloat(this.beamDepth);
    this.n = nValue.toFixed(2);
  }

  calculateMOne() {
    const mOneValue =
      parseFloat(this.r) *
      parseFloat(this.beamLength) *
      (parseFloat(this.beamDepth) * parseFloat(this.beamDepth));
    this.mOne = mOneValue.toFixed(0);
  }

  calculateMTwo() {
    const mTwoValue = parseInt(this.bendingMoment) * 1000 - parseInt(this.mOne);
    this.mTwo = mTwoValue.toString();
  }

  calculateASTOne() {
    const aSTOneValue =
      parseInt(this.mOne) /
      (parseFloat(this.sigmaST) *
        parseFloat(this.j) *
        parseFloat(this.beamDepth));
    this.aSTOne = aSTOneValue.toFixed(2);
  }

  calculateASTTwo() {
    const aSTTwoValue =
      parseInt(this.mTwo) /
      (parseFloat(this.sigmaST) *
        (parseInt(this.beamDepth) - parseInt(this.effectiveCover)));
    this.aSTTwo = aSTTwoValue.toFixed(1);
  }

  calculateAST() {
    const setASTValue = parseFloat(this.aSTOne) + parseFloat(this.aSTTwo);
    this.aST = setASTValue.toFixed(2);
  }

  calculateAPhi() {
    const aPhiValue =
      0.785 * (parseInt(this.noOfBars) * parseInt(this.noOfBars));
    this.aPhi = aPhiValue.toFixed(0);
  }

  calculateBarsRequired() {
    const barsRequiredValue = parseFloat(this.aST) / parseFloat(this.aPhi);
    const roundedValue = Math.ceil(barsRequiredValue);
    this.barsRequired = roundedValue.toString();
  }

  calculateASC() {
    const aSCValue =
      (parseFloat(this.m) *
        parseFloat(this.aSTTwo) *
        (parseFloat(this.beamDepth) - parseFloat(this.n))) /
      ((1.5 * parseFloat(this.m) - 1) *
        (parseFloat(this.n) - parseFloat(this.effectiveCover)));
    this.aSC = aSCValue.toFixed(1);
  }

  calculateTotalNoOfBars() {
    const totalNoOfBarsValue = parseFloat(this.aSC) / 113;
    const roundedTotalBars = Math.ceil(totalNoOfBarsValue);
    this.totalNoOfBars = roundedTotalBars.toString();
  }

  handleKeyPress(event: any, calculationFunction: () => void) {
    if (event.key === 'Enter') {
      calculationFunction();
    }
  }

  calculate() {
    this.calculateM();
    this.calculateK();
    this.calculateJ();
    this.calculateR();
    this.calculateN();
    this.calculateMOne();
    this.calculateMTwo();
    this.calculateASTOne();
    this.calculateASTTwo();
    this.calculateAST();
    this.calculateAPhi();
    this.calculateBarsRequired();
    this.calculateASC();
    this.calculateTotalNoOfBars();
  }

  resetCalculated() {
    this.beamLength = '350';
    this.effectiveCover = '50';
    this.beamDepth = '650';
    this.bendingMoment = '185000';
    this.sigmaCBC = '7';
    this.sigmaST = '230';
    this.noOfBars = '20';
    this.k = '';
    this.m = '';
    this.j = '';
    this.r = '';
    this.n = '';
    this.mOne = '';
    this.mTwo = '';
    this.aSTOne = '';
    this.aSTTwo = '';
    this.aST = '';
    this.aPhi = '';
    this.barsRequired = '';
    this.aSC = '';
    this.totalNoOfBars = '';
  }
}
