import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Breed } from '../../models/breed';
import { DogService } from '../../services/dog.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-breed-detail',
  standalone: false,
  templateUrl: './breed-detail.component.html',
  styleUrl: './breed-detail.component.css'
})
export class BreedDetailComponent implements OnInit {
  breed: Breed | null = null;
  loading = true;
  error = '';
  message = '';
  storageError = '';
  isFavorite = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dogService: DogService,
    private readonly favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    void this.loadBreed();
  }

  async loadBreed(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.error = '';

    if (!Number.isInteger(id) || id <= 0) {
      this.error = 'El identificador de la raza no es válido.';
      this.loading = false;
      return;
    }

    try {
      // Consumo de Promise con async/await. Aquí manejamos un Objeto Breed.
      this.breed = await this.dogService.getBreed(id);
      this.isFavorite = this.favoriteService.getFavorite()?.id === this.breed.id;
    } catch (error) {
      this.error = error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)
        ? 'La API requiere una clave válida. Configura dogApiKey en el archivo environment de tu entorno.'
        : 'No se pudo cargar la raza. Puede que no exista o que la API no esté disponible.';
    } finally {
      this.loading = false;
    }
  }

  saveFavorite(): void {
    if (!this.breed) {
      return;
    }

    this.storageError = '';
    this.message = '';

    try {
      // Pasamos una función como parámetro: este es el callback solicitado.
      this.favoriteService.saveFavorite(this.breed, () => {
        this.isFavorite = true;
        this.message = 'Raza favorita guardada. Puedes verla en Inicio.';
      });
    } catch {
      this.storageError = 'No se pudo guardar. Revisa los permisos de almacenamiento del navegador.';
    }
  }
}
