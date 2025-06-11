export interface MenuItem {
  id: number;
  name: string;
  genre_name: string;
  noodle_name: string;
  soup_name: string;
  image_url: string;
}

export interface RandomMenusResponse {
  menus: MenuItem[];
}
