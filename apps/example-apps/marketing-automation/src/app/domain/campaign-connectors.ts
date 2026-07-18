export function campaignInputId(nodeId: string): string {
  return `${nodeId}:input`;
}

export function campaignOutputId(nodeId: string, outputKey: string): string {
  return `${nodeId}:output:${outputKey}`;
}
