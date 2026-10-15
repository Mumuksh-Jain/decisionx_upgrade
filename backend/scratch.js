const line = "Use only verifiable claims, avoid stereotypes, and state uncertainty clearly.";
console.log("Original:", line);
console.log("Current:", line.replace(/[-*•]/g, " ").replace(/[^\w\s']/g, " ").split(/\s+/).filter(Boolean).join(" "));
console.log("Proposed:", line.replace(/[-*•]/g, " ").replace(/[^\w\s',.:;\-?!]/g, " ").split(/\s+/).filter(Boolean).join(" "));
