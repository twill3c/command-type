/** 入力照合の結果(F-04)。 */
export interface MatchResult {
  /** 先頭から連続して一致している文字数。 */
  matchedLength: number;
  /** 最初の不一致位置(入力側の index)。不一致がなければ null。打ち過ぎは超過開始位置。 */
  missIndex: number | null;
  /** 入力が target と完全一致か(F-05 の Enter 判定に使う)。 */
  complete: boolean;
}

export function matchInput(target: string, input: string): MatchResult {
  let matched = 0;
  while (
    matched < input.length &&
    matched < target.length &&
    input[matched] === target[matched]
  ) {
    matched++;
  }
  const complete = matched === target.length && input.length === target.length;
  const missIndex = complete || input.length === matched ? null : matched;
  return { matchedLength: matched, missIndex, complete };
}
