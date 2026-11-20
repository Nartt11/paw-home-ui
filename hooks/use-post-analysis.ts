import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import postAnalysisService from "@/services/post-analysis";

export const postAnalysisKeys = {
  all: ["post-analysis"] as const,
  byPost: (postId: string) => [...postAnalysisKeys.all, "post", postId] as const,
  metrics: () => [...postAnalysisKeys.all, "metrics"] as const,
  model: () => [...postAnalysisKeys.all, "model"] as const,
};

export function usePostAnalysis(postId?: string) {
  return useQuery({
    queryKey: postAnalysisKeys.byPost(postId ?? ""),
    queryFn: () => postAnalysisService.getAnalysis(postId as string),
    enabled: !!postId,
  });
}

export function usePostAnalysisMetrics() {
  return useQuery({
    queryKey: postAnalysisKeys.metrics(),
    queryFn: postAnalysisService.getMetrics,
  });
}

export function usePostAnalysisModel() {
  return useQuery({
    queryKey: postAnalysisKeys.model(),
    queryFn: postAnalysisService.getModel,
  });
}

export function useSwitchPostAnalysisModel() {
  const queryClient = useQueryClient();
  return useMutation({
    // null resets to the default model
    mutationFn: (model: string | null) =>
      model ? postAnalysisService.switchModel(model) : postAnalysisService.resetModel(),
    onSuccess: (data) => queryClient.setQueryData(postAnalysisKeys.model(), data),
  });
}
