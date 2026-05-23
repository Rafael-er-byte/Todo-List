import None from "../core/objects/None";

export default function isNone(value: unknown): boolean {
  return value instanceof None;
}
