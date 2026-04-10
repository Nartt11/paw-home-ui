import http from "@/lib/http";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";
import { Pet } from "@/types/pet.type";

export interface PetListConfig {
  page?: number;
  size?: number;
  search?: string;
  species?: string;
  breed?: string;
}

const petService = {
  getAllPets(params: PetListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Pet>>>("/pets", { params });
  },
  getPetById(petId: string) {
    return http.get<BaseResponse<Pet>>(`/pets/${petId}`);
  },
};

export default petService;
