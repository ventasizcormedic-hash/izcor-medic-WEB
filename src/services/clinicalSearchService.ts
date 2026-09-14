export const expandClinicalQuery = (q: string) => ({
  expandedTerms: [q],
  suggestedCorrection: null,
});

export const clinicalSearchService: any = new Proxy({}, {
  get: () => () => ({ expandedTerms: [], suggestedCorrection: null })
});
