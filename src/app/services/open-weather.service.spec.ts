import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { OpenWeatherService } from './open-weather.service';
import { Cities, City, Weather } from '../model';

describe('OpenWeatherService', () => {
  let service: OpenWeatherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpenWeatherService],
    });

    service = TestBed.inject(OpenWeatherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('getCities', () => {
    it('should return cities', () => {
      const citiesMock: Cities = [
        { name: 'Berlin' } as City,
        { name: 'Kiev' } as City,
      ];
      service.getCities('').subscribe((cities: Cities) => {
        expect(cities).toEqual(citiesMock);
      });
      const req = httpTestingController.expectOne({
        method: 'GET',
        url: `./assets/city.list.json`,
      });
      req.flush(citiesMock);
    });
  });

  describe('getWeather', () => {
    it('should return weather', () => {
      const weatherMock: Weather = { name: 'Warsaw' } as Weather;
      const cityMock: City = {
        coord: {
          lat: 1,
          lon: 2,
        },
      } as City;
      service.getWeather(cityMock).subscribe((weather: Weather) => {
        expect(weather).toEqual(weatherMock);
      });
      const req = httpTestingController.expectOne({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${cityMock.coord.lat}&lon=${cityMock.coord.lon}&appid=${service['apiKey']}`,
      });
      req.flush(weatherMock);
    });
  });
});
