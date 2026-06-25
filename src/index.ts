import fs from "fs";
//import { GenerateContentResponse } from "@google/genai";
import { reviewCode } from "./review.js";
import { reviewJsonSchema, reviewSchema } from "./schema.js";
import { redactSecrets } from "./redact-secrets.js";
import { failClosedResult } from "./fail-closed-result.js";
import { postPRComment } from "./postPRComment.js";

const code = `
def calculate_shipping(weight_kg, distance_km, express=False):
    if weight_kg <= 0 or distance_km <= 0:
        raise ValueError("Weight and distance must be positive")

    base_rate = 2.50
    per_kg = 0.50
    per_km = 0.01

    cost = base_rate + (weight_kg * per_kg) + (distance_km * per_km)

    if express:
        cost *= 1.5

    if weight_kg > 30:
        cost += 10.00  # Heavy package surcharge

    return round(cost, 2)
`;

const badCode = `
  app.get("/user", async (req, res) => {
      const result = await db.query(
          "SELECT * FROM users WHERE id = " + req.query.id},
      );
      res.json(result.rows);
  });
`;

function parseGeminiRes(response: any): typeof reviewSchema {
  //return reviewSchema.parse(response.candidates[0].content.parts[0].text);
  return JSON.parse(response.candidates[0].content.parts[0].text);
}

async function main() {
  const isGitHubAction = process.env.GITHUB_ACTIONS === "true";

  const redacted = redactSecrets(badCode);
  const response = await reviewCode(redacted, reviewJsonSchema);

  try {
    const validated = parseGeminiRes(response);
    console.log(JSON.stringify(validated, null, 2));

    if (isGitHubAction) {
      await postPRComment(validated);
    } else {
      console.log(JSON.stringify(validated, null, 2));
    }
  } catch (err) {
    console.error("-error-");
    console.error(JSON.stringify(failClosedResult(err), null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
