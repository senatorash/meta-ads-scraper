import { argv } from "process";
import { initialSync } from "./services/SyncServices/initialSync";
import { incrementalSync } from "./services/SyncServices/IncrementalSync";

const main = async () => {
  const command = argv[2];
  if (command === "initialSync") {
    const url = argv[3];
    const max = argv[4] ? parseInt(argv[4], 10) : undefined;
    if (!url) {
      throw new Error("Usage: node dist/index.js initial <url> [max]");
    }
    await initialSync(url, max);
  } else if (command === "incrementalSync") {
    const pageId = argv[3];
    if (!pageId) {
      throw new Error("Usage: node dist/index.js incrementalSync <pageId>");
    }
    await incrementalSync(pageId);
  } else {
    console.log("Commands: initialSync <url> [max], incrementalSync <pageId>");
  }
};

main();
