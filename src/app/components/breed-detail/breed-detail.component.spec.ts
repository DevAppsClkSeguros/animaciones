import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, RouterModule } from '@angular/router';
import { DogService } from '../../services/dog.service';
import { FavoriteService } from '../../services/favorite.service';
import { BreedDetailComponent } from './breed-detail.component';

describe('BreedDetailComponent', () => {
  let fixture: ComponentFixture<BreedDetailComponent>;
  let dogService: jasmine.SpyObj<DogService>;
  let favoriteService: jasmine.SpyObj<FavoriteService>;
  const route = { snapshot: { paramMap: convertToParamMap({ id: '1' }) } };

  beforeEach(async () => {
    route.snapshot.paramMap = convertToParamMap({ id: '1' });
    dogService = jasmine.createSpyObj('DogService', ['getBreed']);
    dogService.getBreed.and.resolveTo({ id: 1, name: 'Affenpinscher' });
    favoriteService = jasmine.createSpyObj('FavoriteService', ['getFavorite', 'saveFavorite']);
    favoriteService.getFavorite.and.returnValue(null);
    favoriteService.saveFavorite.and.callFake((_breed, onSaved) => onSaved());

    await TestBed.configureTestingModule({
      declarations: [BreedDetailComponent],
      imports: [CommonModule, RouterModule],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: route },
        { provide: DogService, useValue: dogService },
        { provide: FavoriteService, useValue: favoriteService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BreedDetailComponent);
  });

  it('should create and load a breed using a Promise', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(dogService.getBreed).toHaveBeenCalledWith(1);
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Affenpinscher');
  });

  it('should save the favorite and execute the callback', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(favoriteService.saveFavorite).toHaveBeenCalled();
    expect(fixture.componentInstance.isFavorite).toBeTrue();
    expect(fixture.componentInstance.message).toContain('guardada');
  });

  it('should reject an invalid route id without calling the API', async () => {
    route.snapshot.paramMap = convertToParamMap({ id: 'invalid' });
    await fixture.componentInstance.loadBreed();
    expect(dogService.getBreed).not.toHaveBeenCalled();
    expect(fixture.componentInstance.error).toContain('no es válido');
  });

  it('should show an error when the request fails', async () => {
    dogService.getBreed.and.rejectWith(new Error('Network error'));
    await fixture.componentInstance.loadBreed();
    expect(fixture.componentInstance.loading).toBeFalse();
    expect(fixture.componentInstance.error).toContain('No se pudo cargar');
  });
});
