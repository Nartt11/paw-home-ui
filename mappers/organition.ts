
import { OrganizationDto, OrganizationSummaryDto } from "@/services/organization/organization-dto";
import { Organization, OrganizationSummary } from "@/types/organization.type,";

export function mapOrganizationSummary(
  dto: OrganizationSummaryDto,
): OrganizationSummary {
  return {
    organizationId: dto.organizationId,
    name: dto.name,
    type: dto.type,
    status: dto.status,
    streetAddress: dto.streetAddress,
    wardName: dto.wardName,
    provinceName: dto.provinceName,
    phone: dto.phone,
    email: dto.email,
  };
}

export function mapOrganization(dto: OrganizationDto): Organization {
  return {
    organizationId: dto.organizationId,
    name: dto.name,

    description: dto.description,
    type: dto.type,
    streetAddress: dto.streetAddress,
    wardName: dto.wardName,
    provinceName: dto.provinceName,
    phone: dto.phone,
    email: dto.email,
    officialLink: dto.officialLink,
    latitude: dto.latitude,
    longitude: dto.longitude,
    status: dto.status,
    createdBy: dto.createdBy,
  };
}
