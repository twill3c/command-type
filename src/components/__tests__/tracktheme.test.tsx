import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GameScreen } from "../GameScreen";
import { LevelSelect } from "../LevelSelect";

const noop = () => {};

describe("T-033: トラック基調色のスコープ付与(§7.1)", () => {
  it.each(["linux", "python", "typescript"] as const)(
    "選択画面のルートに track-%s クラスが付く",
    (track) => {
      const html = renderToStaticMarkup(
        <LevelSelect track={track} onTrackChange={noop} onSelect={noop} />,
      );
      expect(html).toMatch(new RegExp(`class="select track-${track}"`));
    },
  );

  it.each(["linux", "python", "typescript"] as const)(
    "ゲーム画面のルートに track-%s クラスが付く",
    (track) => {
      const html = renderToStaticMarkup(
        <GameScreen track={track} level="beginner" seed={1} onFinish={noop} />,
      );
      expect(html).toMatch(new RegExp(`class="game track-${track}"`));
    },
  );
});
