/**
 * Simple Client-Side RAG Engine
 * Performs text chunking and keyword-based retrieval.
 */

const RagEngine = {
    /**
     * Splits text into smaller chunks with overlap.
     * @param {string} text - The source text.
     * @param {number} chunkSize - Maximum characters per chunk.
     * @param {number} overlap - Number of characters to overlap between chunks.
     * @returns {Array} Array of chunk strings.
     */
    chunkText: (text, chunkSize = 500, overlap = 50) => {
        if (!text) return [];
        if (text.length <= chunkSize) return [text];

        const chunks = [];
        let start = 0;

        while (start < text.length) {
            let end = start + chunkSize;

            // If we are not at the end, try to break at a space/newline to avoid cutting words
            if (end < text.length) {
                const lastSpace = text.lastIndexOf(' ', end);
                const lastNewline = text.lastIndexOf('\n', end);
                // Prefer breaking at newline if close enough, otherwise space
                const breakPoint = Math.max(lastSpace, lastNewline);

                if (breakPoint > start) {
                    end = breakPoint;
                }
            }

            chunks.push(text.substring(start, end).trim());
            start = end - overlap; // Move back by overlap amount
        }

        return chunks;
    },

    /**
     * Calculates a relevance score for a chunk based on the query.
     * Uses simple keyword frequency and overlap.
     * @param {string} query 
     * @param {string} chunk 
     * @returns {number} Score
     */
    calculateScore: (query, chunk) => {
        if (!query || !chunk) return 0;

        const normalize = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
        const queryTokens = normalize(query);
        const chunkTokens = normalize(chunk);

        if (queryTokens.length === 0 || chunkTokens.length === 0) return 0;

        let score = 0;
        const chunkTokenSet = new Set(chunkTokens);

        // 1. Exact Keyword Match (Overlap)
        queryTokens.forEach(token => {
            if (chunkTokenSet.has(token)) {
                score += 1;
            }
        });

        // 2. Frequency Boost (if a keyword appears multiple times in chunk)
        // We don't want to over-boost, so we use a smaller weight
        queryTokens.forEach(qToken => {
            const count = chunkTokens.filter(cToken => cToken === qToken).length;
            if (count > 1) {
                score += (count - 1) * 0.2;
            }
        });

        // 3. Density penalty (optional, but keeping it simple for now)

        return score;
    },

    /**
     * Retrieves the most relevant chunks from the knowledge base.
     * @param {string} query - The user's prompt/query.
     * @param {Array} knowledgeBase - Array of knowledge objects { name, content, ... }
     * @param {Object} options - { topK, chunkSize }
     * @returns {Array} Array of { sourceName, content, score }
     */
    retrieve: (query, knowledgeBase, options = { topK: 3, chunkSize: 500 }) => {
        if (!query || !knowledgeBase || knowledgeBase.length === 0) return [];

        let allChunks = [];

        // 1. Chunk all knowledge sources
        knowledgeBase.forEach(source => {
            if (!source.content) return;
            const sourceChunks = RagEngine.chunkText(source.content, options.chunkSize);
            sourceChunks.forEach(chunk => {
                allChunks.push({
                    sourceName: source.name,
                    content: chunk,
                    score: 0
                });
            });
        });

        // 2. Score chunks
        allChunks.forEach(chunk => {
            chunk.score = RagEngine.calculateScore(query, chunk.content);
        });

        // 3. Filter zero scores and Sort
        const relevantChunks = allChunks
            .filter(chunk => chunk.score > 0)
            .sort((a, b) => b.score - a.score);

        // 4. Return Top K
        return relevantChunks.slice(0, options.topK);
    }
};

export default RagEngine;
