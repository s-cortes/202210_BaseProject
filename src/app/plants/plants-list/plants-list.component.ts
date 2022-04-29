import { Component, OnInit } from '@angular/core';
import { Plant } from '../models/plant';
import { PlantType } from "../models/plant-type.enum";
import { PlantService } from '../services/plant.service';

@Component({
  selector: 'app-plants-list',
  templateUrl: './plants-list.component.html',
  styleUrls: ['./plants-list.component.css']
})
export class PlantsListComponent implements OnInit {

  plants: Plant[] = [];
  constructor(private plantService: PlantService) {
  }

  ngOnInit() {
    this.getPlants();
  }

  getPlants(): void {
    this.plantService.getPlants().subscribe((plants: Plant[]) =>{
      this.plants = plants;
    });
  }

  getPlantTypes(): string[] {
    return this.plantService.getPlantTypes();
  }

  getCountByPlantType(tipo: string): number {
    return this.plantService.countPlantsByType(this.plants, tipo);
  }

}
