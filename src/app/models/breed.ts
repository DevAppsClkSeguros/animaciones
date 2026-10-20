export interface BreedImage {
  url: string;
}

export interface Breed {
  id: number;
  name: string;
  temperament?: string;
  origin?: string;
  breed_group?: string;
  bred_for?: string;
  life_span?: string;
  height?: { imperial: string; metric: string };
  weight?: { imperial: string; metric: string };
  reference_image_id?: string;
  image?: BreedImage;
}
