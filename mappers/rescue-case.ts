import { RescueCaseDto, RescueCaseSummaryDto } from "@/services/rescue-case/rescue-case-dto"
import { RescueCase, RescueCaseSummary } from "@/types/rescue-case.type"

export function mapRescueCaseSummary (dto: RescueCaseSummaryDto): RescueCaseSummary {
  return {
    caseId: dto.caseId,
    caseCode: dto.caseCode,
    species: dto.species,
    priority: dto.priority,
    status: dto.status,
    reporterUsername: dto.reporterUsername,
    locationText: dto.locationText,
    reportedAt: dto.reportedAt,
  }
}

export function mapRescueCase(dto: RescueCaseDto): RescueCase {
  return {
        ...mapRescueCaseSummary(dto),
        petId: dto.petId,
        petName: dto.petName,
        reportedBy: dto.reportedBy,
        organizationId: dto.organizationId,
        organizationName: dto.organizationName,
        color: dto.color,
        size: dto.size,
        description: dto.description,
        latitude: dto.latitude,
        longitude: dto.longitude,
        wardName: dto.wardName,
        provinceName: dto.provinceName,
        resolvedAt: dto.resolvedAt,
        createdAt: dto.createdAt,
  }
}