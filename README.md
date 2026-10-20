# Razas de perros

Prueba técnica sencilla con Angular 19, The Dog API y CSS puro. Sin NgRx ni librerías de interfaz.

## Ejecutar

```bash
npm install
npm start
```

Abre `http://localhost:4200`.

**Configura primero tu API key:** al verificar el endpoint, The Dog API respondió `403: Authentication required`. Obtén tu propia clave en [thedogapi.com](https://thedogapi.com/) y colócala en `dogApiKey` dentro de:

- `src/environments/environment.development.ts` para `npm start`.
- `src/environments/environment.ts` para el build de producción.

El servicio envía la clave mediante el header `x-api-key`. No se incluye una clave real en el repositorio. Si no está configurada o es inválida, la aplicación muestra un mensaje y permite reintentar.

```bash
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

Las pruebas usan Jasmine/Karma y respuestas HTTP simuladas: no necesitan una API key ni conexión con The Dog API. Debes tener Chrome instalado.

## Archivos

```text
src/
  main.ts                       # Bootstrap de AppModule
  styles.css                    # Estilos compartidos
  environments/
    environment.ts              # Producción: URL, API key y clave AES
    environment.development.ts  # Desarrollo: reemplazado desde angular.json
  app/
    app.module.ts               # Módulo básico: componentes, router, forms y HTTP
    app.routes.ts               # /, /breeds, /breeds/:id
    app.component.{ts,html,css}  # Navegación y router-outlet
    models/
      breed.ts                  # Interfaces Breed y BreedImage
    services/
      dog.service.ts            # API con Observable y Promise
      favorite.service.ts       # localStorage con AES
    components/
      home/home.component.{ts,html,css}
      breed-list/breed-list.component.{ts,html,css}
      breed-detail/breed-detail.component.{ts,html,css}
```

Hay archivos `.spec.ts` para los componentes y servicios.

## Uso

1. Entra a **Ver razas** y busca por nombre.
2. Pulsa **Ver detalle** para consultar una raza.
3. Pulsa **Guardar como favorita**. Se guarda una sola favorita; otra selección reemplaza la anterior.
4. Vuelve a **Inicio** para verla o quitarla. Se conserva al recargar el navegador.

Los nombres y características se muestran en el idioma que entrega la API. Si falta una imagen o un dato, el resto de la pantalla sigue funcionando.

## Checklist de la prueba

| Requisito | Dónde verlo |
| --- | --- |
| Tres componentes navegables y arquitectura modular | `AppModule`, `app.routes.ts`, carpeta `components/` |
| Interfaz TypeScript | `models/breed.ts` |
| Servicio HTTP | `DogService` con `HttpClient` |
| Observable y operador RxJS | `DogService.getBreeds()`, con `map` para ordenar |
| Promise | `DogService.getBreed()`, con `firstValueFrom` y `async/await` |
| `.subscribe()` explícito en componente | `BreedListComponent.loadBreeds()` |
| Array y objeto | `Breed[]` en la lista y `Breed` en el detalle |
| `*ngIf` y `*ngFor` explícitos | Plantillas de componentes; `*ngFor` en la lista |
| Evento `(click)` | Botones de detalle, favorito y reintentar |
| Callback como parámetro | `saveFavorite(breed, onSaved)` y su llamada desde el detalle |
| Persistencia y cifrado simétrico | `FavoriteService`: `CryptoJS.AES.encrypt/decrypt` antes de escribir/al leer |
| CSS responsivo, hover y animación | Grid en lista, Flexbox en detalle, `.breed-card:hover` y `@keyframes fade-in` |
| Entornos configurados y utilizados | `src/environments/`, `angular.json` y los servicios |
| Prueba de creación Jasmine/Karma | `home.component.spec.ts`, entre otras |

## Integrarlo en otro proyecto CLI

Esta versión usa un `AppModule` tradicional (no componentes standalone). En un proyecto Angular 19 equivalente:

1. Copia `src/app/`, `src/environments/`, `src/main.ts` y `src/styles.css`.
2. Instala las dependencias adicionales:

   ```bash
   npm install crypto-js
   npm install --save-dev @types/crypto-js
   ```

3. Copia `fileReplacements` de la configuración `development` y `allowedCommonJsDependencies` de las opciones de build desde `angular.json`.
4. Configura tu API key y conserva el builder Jasmine/Karma para ejecutar los `.spec.ts`.

## Nota sobre seguridad

El cifrado AES cumple la rúbrica, pero **una clave incluida en el frontend no es secreta**. No uses este patrón para contraseñas o información sensible. La API key también puede verse en el navegador; para ocultarla necesitarías un backend. `crypto-js` se utiliza porque lo exige el ejercicio, aunque su mantenimiento está discontinuado.
