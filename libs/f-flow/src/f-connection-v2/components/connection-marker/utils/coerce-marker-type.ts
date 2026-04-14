import { EFMarkerType } from '../enums';

export function coerceMarkerType(
  value: unknown,
  fallbackValue: EFMarkerType = EFMarkerType.START,
): EFMarkerType {
  if (typeof value !== 'string') {
    return fallbackValue;
  }

  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue) {
    return fallbackValue;
  }

  return mapMarkerTypeAlias(normalizedValue) ?? fallbackValue;
}

function mapMarkerTypeAlias(value: string): EFMarkerType | null {
  switch (value) {
    case 'start':
    case 'f-connection-marker-start':
      return EFMarkerType.START;

    case 'end':
    case 'f-connection-marker-end':
      return EFMarkerType.END;

    case 'selected-start':
    case 'f-connection-selected-marker-start':
      return EFMarkerType.SELECTED_START;

    case 'selected-end':
    case 'f-connection-selected-marker-end':
      return EFMarkerType.SELECTED_END;

    case 'start-all-states':
    case 'f-connection-marker-start-all-states':
    case 'start-all':
    case 'all-start':
      return EFMarkerType.START_ALL_STATES;

    case 'end-all-states':
    case 'f-connection-marker-end-all-states':
    case 'end-all':
    case 'all-end':
      return EFMarkerType.END_ALL_STATES;

    default:
      return null;
  }
}
