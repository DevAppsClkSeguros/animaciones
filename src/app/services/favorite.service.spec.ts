import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let service: FavoriteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteService);
    localStorage.removeItem('favorite-breed');
  });

  afterEach(() => localStorage.removeItem('favorite-breed'));

  it('should encrypt, decrypt and execute the callback', () => {
    const breed = { id: 1, name: 'Affenpinscher' };
    const onSaved = jasmine.createSpy('onSaved');
    service.saveFavorite(breed, onSaved);

    const stored = localStorage.getItem('favorite-breed');
    expect(stored).toBeTruthy();
    expect(stored).not.toContain('Affenpinscher');
    expect(service.getFavorite()).toEqual(breed);
    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it('should return null for a missing or corrupted favorite', () => {
    expect(service.getFavorite()).toBeNull();
    localStorage.setItem('favorite-breed', 'invalid-encrypted-data');
    expect(service.getFavorite()).toBeNull();
  });

  it('should remove the stored favorite', () => {
    service.saveFavorite({ id: 1, name: 'Akita' }, () => {});
    service.removeFavorite();
    expect(service.getFavorite()).toBeNull();
  });

  it('should not execute the callback if storage is blocked', () => {
    const onSaved = jasmine.createSpy('onSaved');
    spyOn(localStorage, 'setItem').and.throwError('Storage blocked');
    expect(() => service.saveFavorite({ id: 1, name: 'Akita' }, onSaved)).toThrow();
    expect(onSaved).not.toHaveBeenCalled();
  });
});
