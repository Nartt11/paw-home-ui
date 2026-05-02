import type { Adoption, AdoptionSummary } from "@/types/adoption.type";
import type {
  AdoptionDto,
  AdoptionSummaryDto,
} from "@/services/adoption/adoption-dto";

/**
 * Map DTO -> Domain model (Summary)
 */
export function mapAdoptionSummary(dto: AdoptionSummaryDto): AdoptionSummary {
  return {
    applicationId: dto.applicationId,
    petName: dto.petName,
    applicantUsername: dto.applicantUsername,
    status: dto.status,
    experience: dto.experience,
    liveCondition: dto.liveCondition,
    createdAt: dto.createdAt,
  };
}

/**
 * Map DTO -> Domain model (Detail)
 */
export function mapAdoption(dto: AdoptionDto): Adoption {
  return {
    applicationId: dto.applicationId,
    petName: dto.petName,
    applicantUsername: dto.applicantUsername,
    status: dto.status,
    experience: dto.experience,
    liveCondition: dto.liveCondition,
    createdAt: dto.createdAt,
    petId: dto.petId,
    applicantId: dto.applicantId,
    organizationId: dto.organizationId,
    decidedAt: dto.decidedAt,
    decidedBy: dto.decidedBy,
  };
}
