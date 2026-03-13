// utility to assign consistent badge colors for medical issues/diseases
// every unique issue gets one of the preset tailwind color pairs
type ColorPair = { bg: string; text: string };

// A palette of background/text combinations that look good together
const PALETTE: ColorPair[] = [
  { bg: 'bg-[#FCA5A5]', text: 'text-[#7F1D1D]' },   // red-ish
  { bg: 'bg-[#FED7AA]', text: 'text-[#92400E]' },   // orange
  { bg: 'bg-[#FDE047]', text: 'text-[#713F12]' },   // yellow
  { bg: 'bg-[#A7F3D0]', text: 'text-[#065F46]' },   // green
  { bg: 'bg-[#F472B6]', text: 'text-[#831843]' },   // pink
  { bg: 'bg-[#67E8F9]', text: 'text-[#164E63]' },   // cyan
  { bg: 'bg-[#C084FC]', text: 'text-[#5B21B6]' },   // purple
  { bg: 'bg-blue-200', text: 'text-blue-900' },     // fallback blue
];

// memoized mapping from issue name to chosen color pair
const issueColorMap: Record<string, ColorPair> = {};

export function getIssueBadgeClasses(issue: string): string {
  if (!issue) {
    return `${PALETTE[PALETTE.length - 1].bg} ${PALETTE[PALETTE.length - 1].text}`;
  }

  if (!issueColorMap[issue]) {
    const idx = Object.keys(issueColorMap).length % (PALETTE.length - 1); // leave last slot for fallback
    issueColorMap[issue] = PALETTE[idx];
  }
  const pair = issueColorMap[issue];
  return `${pair.bg} ${pair.text}`;
}
