import { renderMedia, makeCancelSignal } from "@remotion/renderer";
import { expect, test } from "vitest";

test("Should be able to cancel render", async () => {
  try {
    const { cancel, cancelSignal } = makeCancelSignal();
    const val = renderMedia({
      codec: "h264",
      serveUrl:
        "https://649ea0770f2b6b55f2a5425c--effulgent-pixie-5f5cfb.netlify.app/",
      composition: {
        durationInFrames: 1000000,
        fps: 30,
        height: 720,
        id: "react-svg",
        width: 1280,
        defaultProps: {},
        props: {},
      },
      outputLocation: "out/render.mp4",
      cancelSignal,
    });

    setTimeout(() => {
      cancel();
    }, 1000);
    await val;

    throw new Error("Render should not succeed");
  } catch (err) {
    expect((err as Error).message).toContain("renderMedia() got cancelled");
  }
});
