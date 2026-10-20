import { Component, OnInit } from '@angular/core';
import { Breed } from '../../models/breed';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  favorite: Breed | null = null;
  error = '';

  constructor(private readonly favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.favorite = this.favoriteService.getFavorite();
  }

  removeFavorite(): void {
    try {
      this.favoriteService.removeFavorite();
      this.favorite = null;
      this.error = '';
    } catch {
      this.error = 'No se pudo eliminar el favorito. Revisa los permisos del navegador.';
    }
  }
}
