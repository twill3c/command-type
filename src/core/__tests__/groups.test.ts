import { describe, expect, it } from "vitest";
import { datasets, TRACK_GROUPS } from "../data";

describe("T-035: トラックグループの整合(F-15 / §1)", () => {
  it("登録済み全トラックがちょうど 1 つのグループに属する", () => {
    const grouped = TRACK_GROUPS.flatMap((g) => g.tracks);
    expect(grouped.length).toBe(new Set(grouped).size); // 重複なし
    for (const track of datasets.keys()) {
      expect(grouped, `${track} がどのグループにも属していない`).toContain(track);
    }
  });

  it("各グループにラベルと 1 件以上のトラックがある", () => {
    for (const g of TRACK_GROUPS) {
      expect(g.label.length).toBeGreaterThan(0);
      expect(g.tracks.length).toBeGreaterThan(0);
    }
  });
});
