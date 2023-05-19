import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Cities, City, Weather } from '../model';

@Injectable({
  providedIn: 'root',
})
export class OpenWeatherService {
  private apiKey: string = '062b9ab0be2d1edd3092225c8616a764';
  constructor(private httpClient: HttpClient) {}

  getCities(query: string): Observable<Cities> {
    return this.httpClient
      .get<Cities>('./assets/city.list.json')
      .pipe(
        map((cities: Cities) =>
          cities.filter((city: City) => city.name.includes(query))
        )
      );
  }

  getWeather(city: City): Observable<Weather> {
    return this.httpClient
      .get<Weather>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${this.apiKey}`
      )
      .pipe();
  }
}
