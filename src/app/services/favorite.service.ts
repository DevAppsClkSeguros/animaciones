import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { Breed } from '../models/breed';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly storageKey = 'favorite-breed';

  // El callback solo se ejecuta después de guardar correctamente.
  saveFavorite(breed: Breed, onSaved: () => void): void {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(breed), environment.encryptionKey
    ).toString();

    localStorage.setItem(this.storageKey, encrypted);
    onSaved();
  }

  getFavorite(): Breed | null {
    try {
      const encrypted = localStorage.getItem(this.storageKey);
      if (!encrypted) {
        return null;
      }

      const decrypted = CryptoJS.AES.decrypt(
        encrypted, environment.encryptionKey
      ).toString(CryptoJS.enc.Utf8);
      const breed: Breed | null = JSON.parse(decrypted);

      return breed && Number.isInteger(breed.id) && typeof breed.name === 'string'
        ? breed : null;
    } catch {
      // Tolera datos corruptos, una clave diferente o almacenamiento bloqueado.
      return null;
    }
  }

  removeFavorite(): void {
    localStorage.removeItem(this.storageKey);
  }
}
