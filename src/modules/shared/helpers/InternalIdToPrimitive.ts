import InternalId from "../core/objects/InternalId";
import type None from "../core/objects/None";

export default function internalIdToPrimitive(internalId: InternalId | None): number | null {
  return internalId instanceof InternalId ? internalId.getId() : null;
}
