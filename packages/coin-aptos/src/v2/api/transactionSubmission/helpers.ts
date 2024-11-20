export function ValidateFeePayerDataOnSubmission(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  /* eslint-disable-next-line func-names, no-param-reassign */
  descriptor.value = async function (...args: any[]) {
    const [methodArgs] = args;

    if (methodArgs.transaction.feePayerAddress && !methodArgs.feePayerAuthenticator) {
      throw new Error("You are submitting a Fee Payer transaction but missing the feePayerAuthenticator");
    }

    return originalMethod.apply(this, args);
  };

  return descriptor;
}

export function ValidateFeePayerDataOnSimulation(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  /* eslint-disable-next-line func-names, no-param-reassign */
  descriptor.value = async function (...args: any[]) {
    const [methodArgs] = args;

    if (methodArgs.transaction.feePayerAddress && !methodArgs.feePayerPublicKey) {
      throw new Error("You are simulating a Fee Payer transaction but missing the feePayerPublicKey");
    }

    return originalMethod.apply(this, args);
  };

  return descriptor;
}
