import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OpenWeatherService } from './services/open-weather.service';
import {
  Observable,
  Subject,
  debounceTime,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { Cities, City, Weather } from './model';
import {
  faThermometerEmpty,
  faArrowDown91,
  faThermometerHalf,
  faWind,
  faWater,
  faCloud,
  faSun,
  faInfo,
  faMagnifyingGlassLocation,
} from '@fortawesome/free-solid-svg-icons';

const icons = {
  faThermometerEmpty,
  faArrowDown91,
  faWater,
  faThermometerHalf,
  faWind,
  faCloud,
  faSun,
  faInfo,
  faMagnifyingGlassLocation,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  icons = icons;
  cities$: Observable<Cities>;
  weather$: Observable<Weather>;
  cityControl: FormControl = new FormControl();
  selectedCity$: Subject<City> = new Subject<City>();

  constructor(private openWeatherService: OpenWeatherService) {}

  ngOnInit(): void {
    this.cities$ = this.getCities$();
    this.weather$ = this.getWeather$();
  }

  getCities$(): Observable<Cities> {
    return this.cityControl.valueChanges.pipe(
      debounceTime(500),
      filter((value: string) => value.length > 1),
      switchMap((value: string) => this.openWeatherService.getCities(value))
    );
  }

  getWeather$(): Observable<Weather> {
    return this.selectedCity$.pipe(
      debounceTime(500),
      filter((value: City) => typeof value !== 'string'),
      switchMap((city: City) => this.openWeatherService.getWeather(city))
    );
  }

  displayFn(city: City): string {
    return city.name ? city.name : '';
  }
}
