import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { DogService } from './dog.service';

describe('DogService', () => {
  let service: DogService;
  let http: HttpTestingController;
  let originalKey: string;

  beforeEach(() => {
    originalKey = environment.dogApiKey;
    environment.dogApiKey = 'test-key';
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(DogService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.dogApiKey = originalKey;
    http.verify();
  });

  it('should send the API key and sort the Observable response', () => {
    service.getBreeds().subscribe((breeds) => {
      expect(breeds.map((breed) => breed.name)).toEqual(['Akita', 'Beagle']);
    });

    const request = http.expectOne(`${environment.apiUrl}/breeds`);
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('x-api-key')).toBe('test-key');
    request.flush([{ id: 2, name: 'Beagle' }, { id: 1, name: 'Akita' }]);
  });

  it('should return a breed through a Promise', async () => {
    const promise = service.getBreed(1);
    expect(promise instanceof Promise).toBeTrue();
    http.expectOne(`${environment.apiUrl}/breeds/1`).flush({ id: 1, name: 'Akita' });
    expect((await promise).name).toBe('Akita');
  });

  it('should resolve the reference image URL', async () => {
    const promise = service.getBreed(1);
    http.expectOne(`${environment.apiUrl}/breeds/1`).flush({
      id: 1, name: 'Akita', reference_image_id: 'dog-image'
    });
    await Promise.resolve();
    const imageRequest = http.expectOne(`${environment.apiUrl}/images/dog-image`);
    expect(imageRequest.request.headers.get('x-api-key')).toBe('test-key');
    imageRequest.flush({ url: 'https://images.example/dog.jpg' });
    expect((await promise).image?.url).toBe('https://images.example/dog.jpg');
  });

  it('should keep the breed if its image fails to load', async () => {
    const promise = service.getBreed(1);
    http.expectOne(`${environment.apiUrl}/breeds/1`).flush({
      id: 1, name: 'Akita', reference_image_id: 'missing'
    });
    await Promise.resolve();
    http.expectOne(`${environment.apiUrl}/images/missing`).flush('Not found', {
      status: 404, statusText: 'Not found'
    });
    expect((await promise).name).toBe('Akita');
  });
});
