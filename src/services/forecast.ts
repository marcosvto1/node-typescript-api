import { StormGlass } from '../clients/stormGlass';
import { Beach } from '@src/models/beach';
import { ForecastPoint } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';

// Omit extends e omite algo
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {
  rating: number;
}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[]
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string ) {
    super(`Unexpected error during the forecast precessing: ${message}`);
  }
} 

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beachs: Beach[]
  ): Promise<TimeForecast[]> {
    const pointWithCorrectSources: BeachForecast[] = [];
    try {
      for (const beach of beachs) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach);
        pointWithCorrectSources.push(...enrichedBeachData);
      }
      return this.mapForecastByTime(pointWithCorrectSources);
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message);
    }  
  }

  private enrichedBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[] {
    return points.map((e) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...e,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time == point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point]
        });
      }
    }
    return forecastByTime;
  }
}
