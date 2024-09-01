/**
 * Calculates the cosine similarity between two strings.
 *
 * @param {string} str1 - The first string.
 * @param {string} str2 - The second string.
 * @returns {number} - The cosine similarity between the two strings.
 */
export function get_similarity(str1: string, str2: string): number {
    const termFreqMap1 = createTermFrequencyMap(str1);
    const termFreqMap2 = createTermFrequencyMap(str2);
  
    const dotProduct = calculateDotProduct(termFreqMap1, termFreqMap2);
    const magnitude1 = calculateMagnitude(termFreqMap1);
    const magnitude2 = calculateMagnitude(termFreqMap2);
  
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }
  
    return dotProduct / (magnitude1 * magnitude2);
  }
  
  /**
   * Creates a term frequency map for a given string.
   *
   * @param {string} str - The input string.
   * @returns {Record<string, number>} - The term frequency map.
   */
  function createTermFrequencyMap(str: string): Record<string, number> {
    const words = str.split(/\s+/);
    const termFreqMap: Record<string, number> = {};
  
    words.forEach(word => {
      termFreqMap[word] = (termFreqMap[word] || 0) + 1;
    });
  
    return termFreqMap;
  }
  
  /**
   * Calculates the dot product of two term frequency maps.
   *
   * @param {Record<string, number>} map1 - The first term frequency map.
   * @param {Record<string, number>} map2 - The second term frequency map.
   * @returns {number} - The dot product.
   */
  function calculateDotProduct(map1: Record<string, number>, map2: Record<string, number>): number {
    let dotProduct = 0;
  
    for (const key in map1) {
      if (map2[key]) {
        dotProduct += map1[key] * map2[key];
      }
    }
  
    return dotProduct;
  }
  
  /**
   * Calculates the magnitude of a term frequency map.
   *
   * @param {Record<string, number>} termFreqMap - The term frequency map.
   * @returns {number} - The magnitude.
   */
  function calculateMagnitude(termFreqMap: Record<string, number>): number {
    let sumOfSquares = 0;
  
    for (const key in termFreqMap) {
      sumOfSquares += termFreqMap[key] * termFreqMap[key];
    }
  
    return Math.sqrt(sumOfSquares);
  }