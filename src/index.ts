import { argv } from "process";
import { initialSync } from "./services/SyncServices/initialSync";
import { incrementalSync } from "./services/SyncServices/IncrementalSync";

const main = async () => {
  // CLI to trigger initial or incremental sync
  const command = argv[2];
  // Initial Sync
  if (command === "initialSync") {
    // Extract URL and optional max parameter from CLI arguments
    const url = argv[3];
    // Parse max parameter if provided
    const max = argv[4] ? parseInt(argv[4], 10) : undefined;
    if (!url) {
      // If URL is not provided, throw an error with usage instructions
      throw new Error("Usage: npm run dev -- initialSync <url> [max]");
    }

    await initialSync(url, max);
    // Incremental Sync
  } else if (command === "incrementalSync") {
    // Extract pageId from CLI arguments
    const pageId = argv[3];
    if (!pageId) {
      // If pageId is not provided, throw an error with usage instructions
      throw new Error("Usage: npm run dev -- incrementalSync <pageId>");
    }
    await incrementalSync(pageId);
  } else {
    console.log("Commands: initialSync <url> [max], incrementalSync <pageId>");
  }
};

main();
