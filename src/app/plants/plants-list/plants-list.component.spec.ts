/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PlantsListComponent } from './plants-list.component';
import { Plant } from '../models/plant';
import { PlantType } from '../models/plant-type.enum';
import { of } from 'rxjs';
import { PlantService } from '../services/plant.service';

describe('PlantsListComponent', () => {
  const plantServiceSpy = jasmine.createSpyObj(
    'PlantService', ['getPlants', 'getPlantTypes', 'countPlantsByType']
  );

  const expectedPlants: Plant[] = [
    new Plant(1, "Lengua de vaca", "Sansevieria Trifasciata", PlantType.Interior, 140,
      "Templado, cálido", "Tierra orgánica con buen drenaje, arena, cascarilla de arroz"),
    new Plant(2, "Chachafruto", "Schefflera actinophylla", PlantType.Exterior, 1000,
      "Todos", "Sustrato para huerto"),
    new Plant(3, "Espatifilo", "Spathiphyllum Wallasii", PlantType.Interior, 65,
      "Templado, cálido", "Tierra orgánica")
  ];
  const usedTypes: Set<string> = new Set(expectedPlants.map(plant => plant.tipo));

  let component: PlantsListComponent;
  let fixture: ComponentFixture<PlantsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantsListComponent ],
      imports:[ HttpClientTestingModule ],
      providers: [{provide: PlantService, useValue: plantServiceSpy}]
    }).compileComponents()
      .then(() => {
        plantServiceSpy.getPlants.and.returnValue(of(expectedPlants));
        plantServiceSpy.getPlantTypes.and.returnValue(usedTypes);

        fixture = TestBed.createComponent(PlantsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    plantServiceSpy.getPlants.calls.reset();
    plantServiceSpy.getPlantTypes.calls.reset();
  });

  describe('LifeCycle Events', () => {

    it('OnInit Processing', () => {
      plantServiceSpy.getPlants.and.returnValue(of(expectedPlants));
      component.ngOnInit();

      expect(plantServiceSpy.getPlants).toHaveBeenCalled();
      expect(component.plants.length).withContext('To Have Plants')
        .toBe(expectedPlants.length);
    });
  });

  describe('', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('Should Render Table with Plants', () =>{
      component.plants = expectedPlants;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('tbody')))
        .withContext('Table Body Exists').toBeDefined();

      let plantRows: DebugElement[] = fixture.debugElement
        .queryAll(By.css('tbody > tr'));

      const names: string[] = expectedPlants.map(p => p.nombre_comun);
      const weathers: string[] = expectedPlants.map(p => p.clima);
      const types: string[] = expectedPlants.map(p => p.tipo);

      plantRows.forEach(row => {
        expect(names).withContext('Has Plant Name').toContain(
          row.query(By.css('.common-name'))?.nativeElement?.textContent
        );
        expect(types).withContext('Has Plant Weather').toContain(
          row.query(By.css('.type'))?.nativeElement?.textContent
        );
        expect(weathers).withContext('Has Plant Type').toContain(
          row.query(By.css('.weather'))?.nativeElement?.textContent
        );
      });
    });

    it('Should Render Type Counts', () => {
      plantServiceSpy.countPlantsByType.and.callFake((plants: Plant[], type:string) => {
        return type === PlantType.Interior ? 2 : 1;
      });

      component.plants = expectedPlants;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#plantMetadata')))
        .withContext('Types Metadata Exist').toBeDefined();

      usedTypes.forEach((type) => {
        let typeId = '#' + type + 'Count';
        let typeCount = expectedPlants.filter(p => p.tipo === type).length;
        let typeSpan: DebugElement = fixture.debugElement
          .query(By.css(typeId));

        expect(typeSpan?.nativeElement?.textContent)
          .withContext(typeId + ' Metadata Exists')
          .toBe(String(typeCount));
      });
    });
  });
});
