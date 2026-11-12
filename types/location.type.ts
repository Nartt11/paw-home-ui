export interface ProvinceSummary {
  code: number;
  name: string;
  codename: string;
  divisionType: string;
  phoneCode: number;
}

export interface Ward {
  code: number;
  name: string;
  codename: string;
  divisionType: string;
  provinceCode: number;
}

export interface ProvinceDetail extends ProvinceSummary {
  wards: Ward[];
}

export interface ProvinceListParams {
  search?: string;
  page?: number;
  // /locations/p là endpoint duy nhất đọc `size` thay vì `pageSize`
  size?: number;
}

export interface ReverseGeocodeResult {
  displayName: string;
  wardName: string;
  provinceName: string;
}

export interface ResolvedLocation extends ReverseGeocodeResult {
  wardCode: string;
  provinceCode: string;
}
