import { Component } from '@angular/core';

@Component({
  selector: 'app-concrete',
  templateUrl: './concrete.component.html',
  styleUrls: ['./concrete.component.scss'],
})
export class ConcreteComponent {
  beamLength: string = '300';
  effectiveCover: string = '50';
  overallDepth: string = '450';
  beamDepth: string = '';
  beamLoad: string = '19.696';
  totalLoad: string = '';
  factorialLoad: string = '';
  selfWeight: string = '';
  length: string = '5';
  bendingMoment: string = '185000';
  sigmaCBC: string = '7';
  sigmaST: string = '230';
  areaOfBars: string = '16';
  fCK: string = '20';
  fY: string = '415';
  mU: string = '';
  mULim: string = '';
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
  aSTProvided: string = '804.24';
  aSTProvidedOne: string = '';
  aSTProvidedTwo: string = '';
  aSTMin: string = '';
  maxReinforcement: string = '';
  aPhi: string = '';
  barsRequired: string = '';
  aSC: string = '';
  // totalNoOfBars: string = '';
  result: string = '';
  finalResult: string = '';

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

  calculateBeamDepth() {
    const beamDepthValue =
      parseFloat(this.overallDepth) - parseFloat(this.effectiveCover);
    this.beamDepth = beamDepthValue.toFixed(2);
  }

  calculateSelfWeight() {
    const selfWeightValue =
      25 *
      (parseFloat(this.beamLength) / 1000) *
      (parseFloat(this.overallDepth) / 1000);
    this.selfWeight = selfWeightValue.toFixed(3);
  }

  calculateTotalLoad() {
    const totalLoadValue =
      parseFloat(this.beamLoad) + parseFloat(this.selfWeight);
    this.totalLoad = totalLoadValue.toFixed(3);
  }

  calculateFactorialLoad() {
    const factorialLoadValue = 1.5 * parseFloat(this.totalLoad);
    this.factorialLoad = factorialLoadValue.toFixed(3);
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

  calculateMU() {
    // const mUValue = ( parseFloat(this.beamLength) * (parseFloat(this.length) * parseFloat(this.length))) / 8;
    const mUValue =
      (parseFloat(this.factorialLoad) *
        (parseFloat(this.length) * parseFloat(this.length))) /
      8;
    this.mU = mUValue.toFixed(2);
  }

  calculateMULim() {
    const mULimValue =
      0.138 *
      parseFloat(this.fCK) *
      parseFloat(this.beamLength) *
      (parseFloat(this.beamDepth) * parseFloat(this.beamDepth)) *
      10 ** -6;
    this.mULim = mULimValue.toFixed(2);
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

  calculateASTMin() {
    const aSTMinValue =
      (0.85 * parseFloat(this.beamLength) * parseFloat(this.overallDepth)) /
      parseFloat(this.fY);
    this.aSTMin = aSTMinValue.toFixed(2);
  }

  calculateMaxReinforcement() {
    const maxReinforcementValue =
      0.04 * parseFloat(this.beamLength) * parseFloat(this.overallDepth);
    this.maxReinforcement = maxReinforcementValue.toFixed(2);
  }

  calculateAPhi() {
    const aPhiValue =
      0.785 * (parseInt(this.areaOfBars) * parseInt(this.areaOfBars));
    // const aPhiValue =
    //   0.785 * (parseInt(this.noOfBars) * parseInt(this.noOfBars));
    this.aPhi = aPhiValue.toFixed(0);
  }

  // calculateASTProvided() {
  //   console.log();
  //   const aSTProvidedValue =
  //     0.785 * parseInt(this.areaOfBars) * parseFloat(this.barsRequired);
  //   this.aSTProvided = aSTProvidedValue.toFixed(2);
  //   console.log(this.barsRequired);
  // }

  calculateASTProvidedOne() {
    const aSTProvidedOneValue =
      (0.87 *
        parseFloat(this.beamLength) *
        parseFloat(this.beamDepth) *
        parseFloat(this.fCK) +
        Math.sqrt(
          0.7569 *
            Math.pow(parseFloat(this.beamDepth), 2) *
            Math.pow(parseFloat(this.beamLength), 2) *
            (Math.pow(parseFloat(this.fY), 2) -
              (4 * parseFloat(this.fY) * parseFloat(this.m)) /
                (parseFloat(this.beamLength) * parseFloat(this.fCK)))
        )) /
      2;
    this.aSTProvidedOne = aSTProvidedOneValue.toFixed(2);
  }

  calculateBarsRequired() {
    const barsRequiredValue = parseFloat(this.aST) / parseFloat(this.aPhi);
    const roundedValue = Math.ceil(barsRequiredValue);
    this.barsRequired = roundedValue.toFixed(0);
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

  // calculateTotalNoOfBars() {
  //   const totalNoOfBarsValue = parseFloat(this.aSC) / 113;
  //   const roundedTotalBars = Math.ceil(totalNoOfBarsValue);
  //   this.totalNoOfBars = roundedTotalBars.toString();
  // }

  calculateResult() {
    if (this.mULim > this.mU) {
      this.result = 'Singly reinforced';
    } else {
      this.result = 'Doubly reinforced';
    }
  }

  calculateFinalResult() {
    this.finalResult =
      parseFloat(this.aSTMin) < parseFloat(this.aSTProvided) &&
      parseFloat(this.aSTProvided) < parseFloat(this.maxReinforcement)
        ? 'Safe'
        : 'Not safe';
  }

  handleKeyPress(event: any, calculationFunction: () => void) {
    if (event.key === 'Enter') {
      calculationFunction();
    }
  }

  calculate() {
    this.calculateM();
    this.calculateK();
    this.calculateBeamDepth();
    this.calculateSelfWeight();
    this.calculateTotalLoad();
    this.calculateFactorialLoad();
    this.calculateJ();
    this.calculateR();
    this.calculateN();
    this.calculateMU();
    this.calculateMULim();
    this.calculateMOne();
    this.calculateMTwo();
    this.calculateASTOne();
    this.calculateASTTwo();
    this.calculateAST();
    // this.calculateASTProvided();
    this.calculateASTMin();
    this.calculateMaxReinforcement();
    this.calculateAPhi();
    this.calculateBarsRequired();
    this.calculateASC();
    // this.calculateTotalNoOfBars();
    this.calculateResult();
    this.calculateFinalResult();
    this.calculateASTProvidedOne();
    
  }

  resetCalculated() {
    this.beamLength = '350';
    this.effectiveCover = '50';
    this.beamDepth = '';
    this.bendingMoment = '185000';
    this.selfWeight = '';
    this.totalLoad = '';
    this.factorialLoad = '';
    this.sigmaCBC = '7';
    this.sigmaST = '230';
    this.areaOfBars = '20';
    this.mU = '';
    this.mULim = '';
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
    this.aSTMin = '';
    this.maxReinforcement = '';
    // this.aSTProvided = '';
    
    this.aSTProvidedOne = '';
    this.aPhi = '';
    this.barsRequired = '';
    this.aSC = '';
    // this.totalNoOfBars = '';
    this.result = '';
    this.finalResult = '';
  }
}
