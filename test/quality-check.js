import RagEngine from '../src/utils/RagEngine.js';
import { styleText } from 'node:util';

// Simple Test Runner
const runTest = (name, fn) => {
    try {
        fn();
        console.log(`✅ PASS: ${name}`);
        return true;
    } catch (error) {
        console.error(`❌ FAIL: ${name}`);
        console.error(`   Error: ${error.message}`);
        return false;
    }
};

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
};

console.log("\n🔍 Starting Quality Assurance Check...\n");

let passed = 0;
let total = 0;

// --- Test Suite: RagEngine ---
console.log("--- Testing RagEngine Logic ---");

total++;
runTest("Chunking: Splits text correctly", () => {
    const text = "Hello world. This is a test.";
    const chunks = RagEngine.chunkText(text, 10, 2);
    // "Hello worl", "ld. This i", ...
    assert(chunks.length > 0, "Should return chunks");
    assert(chunks[0].length <= 10, "Chunk size should be respected");
}) && passed++;

total++;
runTest("Scoring: Exact match", () => {
    const score = RagEngine.calculateScore("apple", "I like apple pie");
    assert(score >= 1, "Should score for exact match");
}) && passed++;

total++;
runTest("Scoring: No match", () => {
    const score = RagEngine.calculateScore("banana", "I like apple pie");
    assert(score === 0, "Should score 0 for no match");
}) && passed++;

total++;
runTest("Retrieval: Finds relevant chunk", () => {
    const kb = [
        { name: "Doc1", content: "The sky is blue." },
        { name: "Doc2", content: "Apples are red." },
        { name: "Doc3", content: "Bananas are yellow." }
    ];
    const results = RagEngine.retrieve("red apples", kb, { topK: 1 });
    assert(results.length === 1, "Should return 1 result");
    assert(results[0].sourceName === "Doc2", "Should find Doc2");
}) && passed++;

console.log(`\nTests Completed: ${passed}/${total} Passed.\n`);

// --- Manual Checklist ---
console.log("--- Manual Verification Checklist ---");
console.log("Please verify the following UI features manually:");
console.log("[ ] 1. App Logo appears in Header and Taskbar.");
console.log("[ ] 2. Templates save to disk (Restart app and check if templates persist).");
console.log("[ ] 3. RAG: Upload a PDF, enable RAG, and check Preview for 'Retrieved' snippets.");
console.log("[ ] 4. Reasoning: Select 'High' effort and check Preview for planning instructions.");
console.log("\n✅ Quality Check Script Finished.");
