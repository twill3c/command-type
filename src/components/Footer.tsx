const REPO = "https://github.com/twill3c/command-type";

/** 全画面共通のライセンス表記(F-16)。layout で常時描画する。 */
export function Footer() {
  return (
    <footer className="app-footer">
      <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
        MIT License
      </a>{" "}
      © 2026 坂田哲朗 ·{" "}
      <a href={REPO} target="_blank" rel="noreferrer">
        GitHub
      </a>
    </footer>
  );
}
