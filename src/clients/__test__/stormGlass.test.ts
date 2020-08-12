import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedWeather3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockAxios.get
      .mockResolvedValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass = new StormGlass(mockAxios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalizedWeather3HoursFixture);
  });

  it('should explude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300
          },
          time: '2020-04-26T00:00+00:00',
        }
      ],
    }

    mockAxios.get.mockResolvedValue({data: incompleteResponse});
    const stormGlass = new StormGlass(mockAxios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);

  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockAxios.get.mockRejectedValue({message: 'Network Error'});
    const stormGlass = new StormGlass(mockAxios);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to comunicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: {
          errors: ['Rate Limit reached']
        }
      }
    });

    const stormGlass = new StormGlass(mockAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to comunicate to StormGlass: Error: {"errors":["Rate Limit reached"]} Code: 429'
    )

  });

});
