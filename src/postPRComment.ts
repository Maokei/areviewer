import { Octokit } from "@octokit/rest";
import { reviewSchema } from "./schema.js";
import { toMarkdown } from "./to-markdown.js";

export async function postPRComment(
  reviewResult: typeof reviewSchema,
): Promise<void> {
  const token = process.env.GITHUB_TOKEN || process.env.INPUT_GITHUB_TOKEN;
  const repo = process.env.REPO || process.env.INPUT_REPO || process.env.GITHUB_REPOSITORY;
  const prNumber = Number(process.env.PR_NUMBER || process.env.INPUT_PR_NUMBER);

  if (!token || !repo || isNaN(prNumber)) {
    throw new Error(`Missing GITHUB_TOKEN, REPO, or PR_NUMBER. Got token: ${token ? "set" : "missing"}, repo: ${repo}, prNumber: ${prNumber}`);
  }

  const [owner, repoName] = repo.split("/");

  const octokit = new Octokit({ auth: token });

  const body = toMarkdown(reviewResult);

  await octokit.issues.createComment({
    owner: owner || "",
    repo: repoName || "",
    issue_number: prNumber,
    body,
  });
}
