export function validateSellCovenantOutputs(outputs: any[], feeEnable: boolean): {
  valid: boolean;
  errorMessage: string
} {
  let index = 0;
  const checkedOutputs: string[] = [];
  const missingOutputs: string[] = [];
  const extraOutputs: string[] = [];

  const expectedOutputs = [
    { name: 'buyerToken', type: 'token' },
    { name: 'changeToken', type: 'token' },
    { name: 'sellerPrice', type: 'fee' },
    ...(feeEnable ? [{ name: 'platformFee', type: 'fee' }] : []),
    { name: 'buyerChange', type: 'fee' },
  ];



  // Process expected outputs
  for (const [expectedIndex, { name, type }] of expectedOutputs.entries()) {
    if (outputs[index]?.utxoType === type) {
      checkedOutputs.push(name);
      index++;
    } else if (name !== 'changeToken' && name !== 'buyerChange') {
      // Add to missing list
      missingOutputs.push(`${expectedIndex}:${type}(${name})`);
    } else {
      // Skip optional outputs if they are missing
      continue;
    }
  }

  // Capture any extra outputs in the list
  for (let i = index; i < outputs.length; i++) {
    extraOutputs.push(`${i}:${outputs[i]?.utxoType}`);
  }

  // Generate error message
  const missingMessage = missingOutputs.length > 0
    ? `Missing outputs: ${missingOutputs.join(', ')}.`
    : '';

  const extraMessage = extraOutputs.length > 0
    ? `Extra outputs: ${extraOutputs.join(', ')}.`
    : '';

  const errorMessage = [missingMessage, extraMessage].filter(Boolean).join('\n');

  const isValid = missingOutputs.length === 0 && extraOutputs.length === 0;
  return { valid: isValid, errorMessage };
}