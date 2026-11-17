import { describe, expect, it } from "vitest";
import { removeTrackingParams } from "../app/scripts/url.ts";

describe("removeTrackingParams", () => {
  it.each([
    ["https://a.com/p?utm_source=x&id=7&fbclid=abc", "https://a.com/p?id=7"],
    ["https://a.com/p?utm_source=x&utm_medium=y&gclid=1&mc_eid=2", "https://a.com/p"],
    ["https://a.com/p?utm_source=x&id=7#top", "https://a.com/p?id=7#top"],
    ["https://a.com/p?utm_campaign#top", "https://a.com/p#top"],
  ])("removes tracking parameters from %s", (url, expected) => {
    expect(removeTrackingParams(url)).toBe(expected);
  });

  it.each([
    "https://a.com/p",
    "https://a.com/p?q=two%20words&r=a+b&flag",
    "https://a.com/p?utm=1&gclid2=1&my_utm_source=1",
    "https://a.com/#/route?utm_source=x",
  ])("leaves %s unchanged", (url) => {
    expect(removeTrackingParams(url)).toBe(url);
  });

  it("keeps the other parameters exactly as written", () => {
    expect(removeTrackingParams("https://a.com/p?q=two%20words&utm_source=x&r=a+b&flag")).toBe(
      "https://a.com/p?q=two%20words&r=a+b&flag",
    );
  });
});
