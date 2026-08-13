const REPO = "https://github.com/twill3c/command-type";

/** 全画面共通のライセンス表記(F-16)。layout で常時描画する。 */
export function Footer() {
  return (
    <footer className="app-footer">
      <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
        MIT License
      </a>{" "}
      © 2026 坂田哲朗 ・{" "}
      <a href={REPO} target="_blank" rel="noreferrer">
        GitHub
      </a>
      {" ・ "}
      <a
        href="https://claude.ai/code/artifact/b644a11c-96aa-4dce-b79e-645365f2eb75"
        target="_blank"
        rel="noreferrer"
      >
        コマンドタイプの打ち方
      </a>
      {" ・ "}
      <a
        href="https://claude.ai/code/artifact/e72f0ed8-481b-404d-94bb-72a6de934643"
        target="_blank"
        rel="noreferrer"
      >
        コマンドタイプ設計図
      </a>
      {" ・ "}
      <a href="https://app-menu-amber.vercel.app" target="_blank" rel="noopener">
        App Menu
      </a>
    </footer>
  );
}
