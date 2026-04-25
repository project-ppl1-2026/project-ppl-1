import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/profile/security-state/route";
import {
  getAuthenticatedUserIdFromRequest,
  getUserSecurityState,
} from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
  getUserSecurityState: vi.fn(),
}));

const mockGetAuthenticatedUserIdFromRequest = vi.mocked(
  getAuthenticatedUserIdFromRequest,
);
const mockGetUserSecurityState = vi.mocked(getUserSecurityState);

describe("Profile API Routes (/api/profile/security-state)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/profile/security-state", () => {
    it("Harus return 401 jika user belum login", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue(null);
      const req = new Request("http://localhost/api/profile/security-state", {
        method: "GET",
      });
      const res = await GET(req);

      expect(res.status).toBe(401);
    });

    it("Harus mengembalikan security state user", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user1");
      const mockState = {
        hasPassword: true,
        isGoogleLinked: false,
        providerIds: ["credential"],
      };
      mockGetUserSecurityState.mockResolvedValue(mockState);

      const req = new Request("http://localhost/api/profile/security-state", {
        method: "GET",
      });
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.hasPassword).toBe(true);
      expect(json.isGoogleLinked).toBe(false);
    });
  });
});
