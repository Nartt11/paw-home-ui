import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type {
  PostAnalysis,
  PostAnalysisMetrics,
  PostAnalysisModel,
} from "@/types/post.type";

// Confirm / reject / retry are author-only in the backend, so the admin side only reads them.
const postAnalysisService = {
  // GET /api/v1/posts/{id}/analysis
  getAnalysis(postId: string) {
    return http.get<PostAnalysis>(apiEndpoints.posts.analysis(postId));
  },

  // GET /api/v1/admin/ai/post-analysis/metrics (ADMIN)
  getMetrics() {
    return http.get<PostAnalysisMetrics[]>(apiEndpoints.admin.ai.metrics);
  },

  // GET /api/v1/admin/ai/post-analysis/model (ADMIN)
  getModel() {
    return http.get<PostAnalysisModel>(apiEndpoints.admin.ai.model);
  },

  // PUT /api/v1/admin/ai/post-analysis/model (ADMIN) - must be in allowedModels
  switchModel(model: string) {
    return http.put<PostAnalysisModel, { model: string }>(
      apiEndpoints.admin.ai.model,
      { model },
    );
  },

  // DELETE /api/v1/admin/ai/post-analysis/model (ADMIN) - back to the default
  resetModel() {
    return http.delete<PostAnalysisModel>(apiEndpoints.admin.ai.model);
  },
};

export default postAnalysisService;
