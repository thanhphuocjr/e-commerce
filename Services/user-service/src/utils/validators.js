export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
export const OBJECT_ID_RULE_MESSAGE =
  'Your string fails to match the Object Id pattern!';

export const UUID_V4_RULE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const UUID_V4_MESSAGE = 'ID must be a valid UUID v4';
