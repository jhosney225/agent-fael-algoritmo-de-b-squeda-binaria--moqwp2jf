
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

// Binary search implementation with visualization
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let steps = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = arr[mid];

    // Create visualization of current state
    const visualization = createVisualization(arr, left, right, mid, target);
    steps.push({
      left,
      right,
      mid,
      midValue,
      visualization,
      message: `Checking index ${mid} (value: ${midValue})`,
    });

    if (midValue === target) {
      return {
        found: true,
        index: mid,
        steps,
        message: `Found ${target} at index ${mid}!`,
      };
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return {
    found: false,
    index: -1,
    steps,
    message: `${target} not found in array`,
  };
}

function createVisualization(arr, left, right, mid, target) {
  let vis = "[";
  for (let i = 0; i < arr.length; i++) {
    if (i === mid) {
      vis += `[${arr[i]}]`;
    } else if (i >= left && i <= right) {
      vis += `(${arr[i]})`;
    } else {
      vis += ` ${arr[i]} `;
    }
    if (i < arr.length - 1) vis += ", ";
  }
  vis += "]";
  vis += `\nSearching for: ${target}`;
  vis += `\nActive range: indices ${left} to ${right}`;
  return vis;
}

async function analyzeSearchWithClaude(arr, target, searchResult) {
  console.log("\n🤖 Analyzing search with Claude AI...\n");

  const analysisPrompt = `
I just performed a binary search on this array: ${JSON.stringify(arr)}
Looking for the target value: ${target}

Result:
- Found: ${searchResult.found}
- Index: ${searchResult.index}
- Total steps: ${searchResult.steps.length}

Here are the search steps:
${searchResult.steps
  .map(
    (step, i) =>
      `Step ${i + 1}: ${step.message}\n${step.visualization}`
  )
  .join("\n\n")}

Please provide a brief analysis of:
1. The efficiency of this search
2. Why binary search works well for sorted arrays
3. Any observations about the search pattern
`;

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
    });

    const analysis =
      response.content[0].type === "text" ? response.content[0].text : "";
    console.log("Claude's Analysis:");
    console.log("─".repeat(60));
    console.log(analysis);
    console.log("─".repeat(60));
  } catch (error) {
    console.error("Error analyzing with Claude:", error);
  }
}

function displaySearchSteps(searchResult) {
  console.log("\n📊 Binary Search Visualization\n");
  console.log("=".repeat(60));

  searchResult.steps.forEach((step, index) => {
    console.log(`\nStep ${index + 1}:`);
    console.log(step.visualization);
    console.log(`→ ${step.message}`);
  });

  console.log("\n" + "=".repeat(60));
  console.log(`✓ ${searchResult.message}`);
  console.log(`Total comparisons: ${searchResult.steps.length}`);
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  };

  console.log("╔════════════════════════════════════════════════╗");
  console.log("║   Binary Search Algorithm with Visualization   ║");
  console.log("║         Powered by Claude AI Analysis          ║");
  console.log("╚════════════════════════════════════════════════╝\n");

  // Example arrays for testing
  const examples = [
    { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], target: 13 },
    { arr: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], target: 8 },
    { arr: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50], target: 25 },
  ];

  let continueSearching = true;

  while (continueSearching) {
    console.log("\nChoose an option:");
    console.log("1. Run example 1: Search for 13 in [1,3,5,7,9,11,13,15,17,19]");
    console.log("2. Run example 2: Search for 8 in [2,4,6,8,10,12,14,16,18,20]");
    console.log("3. Run example 3: Search for 25 in [1,5,10,15,20,25,30