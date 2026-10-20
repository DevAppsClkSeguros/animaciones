import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Breed, BreedImage } from '../models/breed';

@Injectable({ providedIn: 'root' })
export class DogService {
  private readonly apiUrl = environment.apiUrl;
  private readonly headers = environment.dogApiKey
    ? new HttpHeaders({ 'x-api-key': environment.dogApiKey })
    : new HttpHeaders();

  constructor(private readonly http: HttpClient) {}

  // Observable + operador RxJS: ordenamos el Array por nombre.
  getBreeds(): Observable<Breed[]> {
    return this.http.get<Breed[]>(`${this.apiUrl}/breeds`, { headers: this.headers }).pipe(
      map((breeds) => [...breeds].sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  // Promise: firstValueFrom convierte el Observable HTTP en una promesa.
  async getBreed(id: number): Promise<Breed> {
    const breed = await firstValueFrom(
      this.http.get<Breed>(`${this.apiUrl}/breeds/${id}`, { headers: this.headers })
    );

    // El endpoint de detalle no siempre incluye la URL de la imagen.
    if (!breed.image && breed.reference_image_id) {
      try {
        breed.image = await firstValueFrom(
          this.http.get<BreedImage>(`${this.apiUrl}/images/${breed.reference_image_id}`, {
            headers: this.headers
          })
        );
      } catch {
        // Una imagen no disponible no debe impedir consultar la raza.
      }
    }

    return breed;
  }
}
