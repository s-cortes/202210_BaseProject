/* tslint:disable:no-unused-variable */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Plant } from '../models/plant';
import { PlantType } from '../models/plant-type.enum';
import { PlantService } from './plant.service';

describe('Service: Plant', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlantService]
    });
  });

  describe('HTTP GET Requests', () => {
    const expectedPlants: Plant[] = [
      new Plant(1, "Lengua de vaca", "Sansevieria Trifasciata", PlantType.Interior, 140,
        "Templado, cálido", "Tierra orgánica con buen drenaje, arena, cascarilla de arroz"),
      new Plant(2, "Chachafruto", "Schefflera actinophylla", PlantType.Exterior, 1000,
        "Todos", "Sustrato para huerto"),
      new Plant(3, "Espatifilo", "Spathiphyllum Wallasii", PlantType.Interior, 65,
        "Templado, cálido", "Tierra orgánica")
    ];

    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let exhibitionService: PlantService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      exhibitionService = new PlantService(httpClientSpy);
    });

    describe('Successful Responses', () => {
      it('Should Return List of Exhibitions', (done: DoneFn) => {

        httpClientSpy.get.and.returnValue(of(expectedPlants));

        exhibitionService.getPlants().subscribe({
          next: exhibitions => {
            expect(exhibitions)
              .withContext('Expected Exhibitions')
              .toEqual(expectedPlants);
            done();
          },
          error: done.fail
        });

        expect(httpClientSpy.get.calls.count())
          .withContext('One Call')
          .toBe(1);
      });
    });

    describe('Error Ressponses', () => {
      it('Should Return Empty Exhibition List Upon Error', (done: DoneFn) => {
        let exhibitionServiceSpy = jasmine.createSpyObj('ExhibitionService', ['handleError']);
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({
          error: 'Fake Error Simularion',
          status: 500, statusText: 'Fake Internal Server Error'
        });
        httpClientSpy.get.and.returnValue(throwError(errorResponse));

        exhibitionService.getPlants().subscribe({
          next: plants => {
            expect(plants).toEqual([]);
            done();
          },
          error: error => done.fail('Service should handle the Error')
        });
      });
    });
  });
});
