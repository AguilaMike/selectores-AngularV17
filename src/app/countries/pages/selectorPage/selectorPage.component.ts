import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, JsonPipe],
  templateUrl: './selectorPage.component.html',
  styleUrls: ['./selectorPage.component.css']
})
export class SelectorPageComponent implements OnInit {
  public countriesByRegion: SmallCountry[] = [];
  public bordesByCountry: SmallCountry[] = [];
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.bordesByCountry = []),
        switchMap((region) => this.countriesService.getCountriesByRegion(region))
      )
      .subscribe((countries) => { this.countriesByRegion = countries; });
  }

  onCountryChanged(): void {
    this.myForm.get('country')?.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((code: string) => code.length > 0),
        switchMap((code) => this.countriesService.getCountryByAlphaCode(code)),
        switchMap((country) => this.countriesService.getCountryByBordesByCodes(country.borders))
      )
      .subscribe((countries) => { this.bordesByCountry = countries; });
  }
}
