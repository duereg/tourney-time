const suffix = (n: number): string => {
  const d = n % 100;
  if (d > 3 && d < 21) {
    return 'th';
  }
  return ['th', 'st', 'nd', 'rd'][d % 10] || 'th';
};

export default suffix;
