import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
      });
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('Should Render Image', () => {
    expect(fixture.debugElement.query(By.css('img')))
      .toBeDefined();
  });

  it('Should Render Title', () => {
    let title: DebugElement = fixture.debugElement
      .query(By.css('h1'));
    expect(title?.nativeElement?.textContent)
      .toBeDefined();
  });
});
