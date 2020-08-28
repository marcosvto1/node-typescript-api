import { ForecastPoint } from './../clients/stormGlass';
import { BeachPosition } from './../models/beach';
import { Beach } from '@src/models/beach';
import c from 'config';

// meters ancotonuii
const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0
  },
  waistHigh: {
    min: 1.0,
    max: 2.0
  },
  headHigh: {
    min: 2.0,
    max: 2.5
  }
}
 

export class Rating {
  constructor(private beach: Beach) {}

  getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection  = this.getPositionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingOnWindWavePositions(
      swellDirection,
      windDirection
    );
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);  
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);

    const finalRate = (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

    return Math.round(finalRate);
  }

  getRatingOnWindWavePositions(wavePosition: BeachPosition, windPosition: BeachPosition): number {
    if (wavePosition === windPosition) {
      return 1; 
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      return 5;
    }
    return 3;
  }

  getRatingForSwellSize(height: number): number {
    if (
      height >= waveHeights.ankleToKnee.min && 
      height < waveHeights.ankleToKnee.max) {
      return 2;
    }

    if(
      height >= waveHeights.waistHigh.min &&
      height <  waveHeights.waistHigh.max
    ) {
      return 3;
    }

    if(
      height >= waveHeights.headHigh.min
    ) {
      return 5;
    }

    return 1;
  }

  getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) {
      return 2;
    }
    if (period >= 10 && period < 14) {
      return 4;
    }
    if (period >= 14) {
      return 5;
    } 

    return 1;
  }

  getPositionFromLocation(coordinates: number): BeachPosition {
    if (coordinates >= 310 || (coordinates < 50 && coordinates >= 0)) {
      return BeachPosition.N;
    }

    if (coordinates >= 50 && coordinates < 120) {
      return BeachPosition.E;
    }

    if (coordinates >= 120 && coordinates < 220) {
      return BeachPosition.S
    }
    
    if (coordinates >= 220 && coordinates < 310) {
      return BeachPosition.W;
    }

    return BeachPosition.E;
  }

  private isWindOffShore(wavePosition: BeachPosition, windPosition: BeachPosition): boolean {
    return (
      (wavePosition == BeachPosition.N && windPosition == BeachPosition.S && this.beach.position == BeachPosition.N) ||
      (wavePosition == BeachPosition.S && windPosition == BeachPosition.N && this.beach.position == BeachPosition.S) ||
      (wavePosition == BeachPosition.E && windPosition == BeachPosition.W && this.beach.position == BeachPosition.E) ||
      (wavePosition == BeachPosition.W && windPosition == BeachPosition.E && this.beach.position == BeachPosition.W) 
    );
  }
}