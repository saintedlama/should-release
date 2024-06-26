#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import conventionalRecommendedBump from "conventional-recommended-bump";

const args = yargs(hideBin(process.argv))
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .help()
  .parse();

const verbose = args.verbose;

function whatBump(commits) {
  let shouldRelease = false;
  let major = 0;
  let minor = 0;
  let patch = 0;

  if (verbose) {
    console.log(`analyzing ${commits.length} commits...`);
  }

  commits.forEach((commit) => {
    const breakingHeaderPattern = /^(\w*)(?:\((.*)\))?!: (.*)$/;
    const breakingHeader = breakingHeaderPattern.test(commit.header);

    if (verbose) {
      console.log(
        `commit ${commit.hash}: ${commit.subject} (type: ${commit.type}, notes: ${commit.notes.length}, breakingHeader: ${breakingHeader})`
      );
    }

    if (commit.notes.length > 0 || breakingHeader) {
      shouldRelease = true;
      major++;
      /* eslint-disable-next-line no-constant-condition*/
    } else if (commit.type === "feat" || "perf") {
      shouldRelease = true;
      minor++;
    } else if (commit.type === "fix") {
      shouldRelease = true;
      patch++;
    }
  });

  return {
    shouldRelease,
    major,
    minor,
    patch,
  };
}

conventionalRecommendedBump({ whatBump }, { verbose }, function (err, data) {
  if (err) {
    console.error(err.toString());
    process.exit(1);
  }

  console.log(data);

  if (data.shouldRelease) {
    process.exit(0);
  } else {
    process.exit(2);
  }
});
