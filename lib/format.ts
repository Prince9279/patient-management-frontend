// helpers for formatting patient-related data

/**
 * Format a numeric patient ID into a zero-padded string with "ID-" prefix.
 * e.g. 1 -> "ID-0001", 42 -> "ID-0042".
 */
export function formatPatientId(id: number): string {
  return `ID-${id.toString().padStart(4, '0')}`;
}
