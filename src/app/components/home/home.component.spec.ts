import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let favoriteService: jasmine.SpyObj<FavoriteService>;

  beforeEach(async () => {
    favoriteService = jasmine.createSpyObj('FavoriteService', ['getFavorite', 'removeFavorite']);
    favoriteService.getFavorite.and.returnValue(null);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [CommonModule, RouterModule],
      providers: [provideRouter([]), { provide: FavoriteService, useValue: favoriteService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the saved favorite', () => {
    favoriteService.getFavorite.and.returnValue({ id: 1, name: 'Affenpinscher' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('Affenpinscher');
  });

  it('should remove the favorite on click', () => {
    favoriteService.getFavorite.and.returnValue({ id: 1, name: 'Affenpinscher' });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(favoriteService.removeFavorite).toHaveBeenCalled();
    expect(fixture.componentInstance.favorite).toBeNull();
  });
});
