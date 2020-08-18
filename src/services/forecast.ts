import { StormGlass } from '@src/clients/stormGlass';
import { ForecastPoint } from './../clients/stormGlass';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface Beach {
  lat: number;
  lng: number;
  name: string;
  position: BeachPosition;
  user: string;
}
// Omit extends e omite algo
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {
  rating: number;
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(beachs: Beach[]): Promise<BeachForecast[]> {
    const pointWithCorrectSources:  BeachForecast[] = [];
    for (const beach of beachs) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = points.map((e) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1
        },
        ...e
      }));

      pointWithCorrectSources.push(...enrichedBeachData);
    }

    return pointWithCorrectSources;
  } 
}