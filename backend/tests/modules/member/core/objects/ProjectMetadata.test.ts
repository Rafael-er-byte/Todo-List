import ProjectMetadata from "../../../../../src/modules/member/core/objects/ProjectMetadata";
import { describe, it, expect } from 'vitest';

describe("ProjectMetadata Value Object", () => {
  it("should default to not favorite and not watching", () => {
    const metadata = new ProjectMetadata();

    expect(metadata.favorite()).toBe(false);
    expect(metadata.isWatching()).toBe(false);
  });

  it("should watch and unwatch a project", () => {
    const metadata = new ProjectMetadata();
    const watching = metadata.watchProject();

    expect(watching.isWatching()).toBe(true);
    expect(metadata.isWatching()).toBe(false);

    const unwatched = watching.unwatchProject();
    expect(unwatched.isWatching()).toBe(false);
  });

  it("should mark and unmark a project as favorite", () => {
    const metadata = new ProjectMetadata();
    const favorite = metadata.markAsFavorite();

    expect(favorite.favorite()).toBe(true);
    expect(metadata.favorite()).toBe(false);

    const unfavorite = favorite.unmarkAsFavorite();
    expect(unfavorite.favorite()).toBe(false);
  });

  it("should preserve watch state when toggling favorite", () => {
    const metadata = new ProjectMetadata(false, true);
    const favorite = metadata.markAsFavorite();

    expect(favorite.favorite()).toBe(true);
    expect(favorite.isWatching()).toBe(true);
  });
});