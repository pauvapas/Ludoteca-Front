export function validateFields <TData>(obj: Partial<TData>, validateFields: readonly string[]): obj is Required<TData> {
  return validateFields.every((field) => {
    const value = obj[field as keyof TData];

    if (typeof value === 'string') {
      return value.trim() !== '';
    }

    return value !== undefined && value !== null && value !== '';    
  });
}