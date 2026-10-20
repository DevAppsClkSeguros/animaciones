import { Component, DestroyRef, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Breed } from '../../models/breed';
import { DogService } from '../../services/dog.service';

@Component({
  selector: 'app-breed-list',
  standalone: false,
  templateUrl: './breed-list.component.html',
  styleUrl: './breed-list.component.css'
})
export class BreedListComponent implements OnInit {
  breeds: Breed[] = [];
  filteredBreeds: Breed[] = [];
  searchTerm = '';
  loading = true;
  error = '';

  constructor(
    private readonly dogService: DogService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadBreeds();
  }

  loadBreeds(): void {
    this.loading = true;
    this.error = '';

    // Suscripción explícita; se cancela si se destruye el componente.
    this.dogService.getBreeds().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (breeds) => {
        this.breeds = breeds;
        this.filterBreeds();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.status === 401 || error.status === 403
          ? 'La API requiere una clave válida. Configura dogApiKey en el archivo environment de tu entorno.'
          : 'No se pudieron cargar las razas. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  filterBreeds(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredBreeds = this.breeds.filter((breed) =>
      breed.name.toLowerCase().includes(term)
    );
  }

  selectBreed(breed: Breed): void {
    void this.router.navigate(['/breeds', breed.id]);
  }
}
