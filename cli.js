#!/usr/bin/env node

const verbose = process.argv.includes("-v");

const conventionalRecommendedBump = require("conventional-recommended-bump");

function whatBump(commits) {
  let shouldRelease = false;
  let major = 0;
  let minor = 0;
  let patch = 0;

  commits.forEach((commit) => {
    if (verbose) {
      console.log(commit);
    }

    if (commit.notes.length > 0) {
      shouldRelease = true;
      major++;
    } else if (commit.type === "feat") {
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

conventionalRecommendedBump({ whatBump }, { verbose: true }, function (err, data) {
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
