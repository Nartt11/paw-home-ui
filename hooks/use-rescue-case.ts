import rescueService from "@/services/rescue-case/rescue-case";
import { useQuery } from "@tanstack/react-query";

export function useRescueCaseList(page: number, size: number) {
    return useQuery({
      queryKey: ["rescue-cases", { page, size }],
      queryFn: () => rescueService.getAllRescueCases({ page, size }),
    });
}

export function useRescueCaseDetail(id: string) {
    return useQuery({
      queryKey: ["rescue-case", id],
      queryFn: () => rescueService.getRescueCaseById(id as string),
      enabled: Boolean(id),
    });
}