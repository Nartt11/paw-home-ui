import { PetDto, PetMediaDto, PetMedicalRecordDto, PetOwnershipDto, PetSummaryDto } from "@/services/pet/pet-dto";
import { Pet, PetMedia, PetMedicalRecord, PetOwnership, PetSummary } from "@/types/pet.type";

export function mapPetSummary(dto: PetSummaryDto): PetSummary { 
    return {
        petId: dto.petId,
        petCode: dto.petCode,
        name: dto.name,
        species: dto.species,
        breed: dto.breed,
        age: dto.age,
        ageDisplay: dto.ageDisplay,
        vaccinated: dto.vaccinated,
        gender: dto.gender,
        status: dto.status,
        healthStatus: dto.healthStatus,
        owner: {
            ownerType: dto.owner.ownerType,
            ownerId: dto.owner.ownerId,
            name: dto.owner.name,
            avatarUrl: dto.owner.avatarUrl,
            phone: dto.owner.phone,
            caretakerUserId: dto.owner.caretakerUserId,
            caretakerName: dto.owner.caretakerName,
            caretakerAvatarUrl: dto.owner.caretakerAvatarUrl,
            caretakerPhone: dto.owner.caretakerPhone,
        },
        organization: dto.organization,
        province: dto.province,
        provinceCode: dto.provinceCode,
        ward: dto.ward,
        wardCode: dto.wardCode,
        imageUrl: dto.imageUrl,

    }
}

export function mapPet(dto: PetDto): Pet {
    return {
      petId: dto.petId,
      petCode: dto.petCode,
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      age: dto.age,
      ageDisplay: dto.ageDisplay,
      vaccinated: dto.vaccinated,
      gender: dto.gender,
      status: dto.status,
      healthStatus: dto.healthStatus,
      owner: {
        ownerType: dto.owner.ownerType,
        ownerId: dto.owner.ownerId,
        name: dto.owner.name,
        avatarUrl: dto.owner.avatarUrl,
        phone: dto.owner.phone,
        caretakerUserId: dto.owner.caretakerUserId,
        caretakerName: dto.owner.caretakerName,
        caretakerAvatarUrl: dto.owner.caretakerAvatarUrl,
        caretakerPhone: dto.owner.caretakerPhone,
      },
      organization: dto.organization,
      province: dto.province,
      provinceCode: dto.provinceCode,
      ward: dto.ward,
      wardCode: dto.wardCode,
      color: dto.color,
      weight: dto.weight,
      description: dto.description,
      neutered: dto.neutered,
      rescueDate: dto.rescueDate,
      rescueLocation: dto.rescueLocation,
      imageUrls: dto.imageUrls,

      shelterId: dto.shelterId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
}
 
export function mapPetMedia(dto: PetMediaDto): PetMedia {
    return {
        mediaId: dto.mediaId,
        uploaderId: dto.uploaderId,
        url: dto.url,
          type: dto.type,
          createdAt: dto.createdAt,

    }
}

export function mapPetOwnership(dto: PetOwnershipDto): PetOwnership {
    return {
        petId: dto.petId,
        ownerType: dto.ownerType,
        ownerId: dto.ownerId,
          ownerName: dto.ownerName,
  fromTime: dto.fromTime,
  toTime: dto.toTime,
    }
}
 export function mapPetMedicalRecord(dto: PetMedicalRecordDto): PetMedicalRecord {
    return {
        recordId: dto.recordId,
        petId: dto.petId,
        description: dto.description,
        vaccine: dto.vaccine,
        diagnosis: dto.diagnosis,
        recordDate: dto.recordDate,
        createdBy: dto.createdBy,
    }
}