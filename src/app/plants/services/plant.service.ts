import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Plant } from '../models/plant';
import { catchError, Observable, of } from 'rxjs';
import { PlantType } from '../models/plant-type.enum';


@Injectable({
  providedIn: 'root'
 })
export class PlantService {

  constructor(private http: HttpClient) { }

  getPlants(): Observable<Plant[]> {
    const requestUrl: string = environment.baseUrl + environment.getUrl;
    return this.http.get<Plant[]>(requestUrl)
      .pipe(catchError(this.handleError<Plant[]>('Getting Plants', [])));
  }

  getPlantTypes(): string[] {
    return Object.keys(PlantType).filter((v) => isNaN(Number(v)));
  }

  countPlantsByType(plants: Plant[], type:string): number {
    return plants.filter(currPlant => currPlant.tipo === type).length;
  }

  private handleError<T>(operation:string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
