export interface MenuItem {
  id: number;
  name: string;
  genre_name: string;
  noodle_name: string;
  soup_name: string;
  image_url: string;
  name_kana?: string;
  business_hours?: string;
  regular_holiday?: string;
  description?: string;
}

export interface RandomMenusResponse {
  menus: MenuItem[];
}
