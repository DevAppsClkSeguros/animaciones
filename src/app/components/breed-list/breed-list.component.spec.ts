import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DogService } from '../../services/dog.service';
import { BreedListComponent } from './breed-list.component';

describe('BreedListComponent', () => {
  let fixture: ComponentFixture<BreedListComponent>;
  let dogService: jasmine.SpyObj<DogService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    dogService = jasmine.createSpyObj('DogService', ['getBreeds']);
    dogService.getBreeds.and.returnValue(of([
      { id: 1, name: 'Affenpinscher' }, { id: 2, name: 'Labrador' }
    ]));
    router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.resolveTo(true);

    await TestBed.configureTestingModule({
      declarations: [BreedListComponent],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: DogService, useValue: dogService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BreedListComponent);
  });

  it('should create and render the breed list', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.breed-card').length).toBe(2);
    expect(fixture.componentInstance.loading).toBeFalse();
  });

  it('should filter by name ignoring case and surrounding spaces', () => {
    fixture.detectChanges();
    fixture.componentInstance.searchTerm = ' LAB ';
    fixture.componentInstance.filterBreeds();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.breed-card').length).toBe(1);
    expect(fixture.componentInstance.filteredBreeds[0].name).toBe('Labrador');
  });

  it('should navigate when the detail button is clicked', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.breed-card button').click();
    expect(router.navigate).toHaveBeenCalledWith(['/breeds', 1]);
  });

  it('should explain when the API key is missing', () => {
    dogService.getBreeds.and.returnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
    fixture.detectChanges();
    expect(fixture.componentInstance.loading).toBeFalse();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('dogApiKey');
  });
});
