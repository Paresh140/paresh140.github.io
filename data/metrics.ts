// Confusion matrix for the command palette's "show confusion matrix" command.
// PLACEHOLDER values: replace with the real matrix from your evaluation run.
export const confusionLabels = ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc'];

export const confusionMatrix: number[][] = [
  [18, 1, 2, 0, 1, 0, 0],
  [1, 22, 1, 0, 1, 0, 0],
  [2, 1, 30, 0, 2, 1, 0],
  [0, 0, 0, 9, 0, 0, 0],
  [1, 1, 3, 0, 26, 2, 0],
  [0, 0, 2, 0, 3, 61, 0],
  [0, 0, 0, 0, 0, 0, 8],
];
