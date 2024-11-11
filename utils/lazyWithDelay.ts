// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyWithDelay = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  delay: number,
): Promise<{ default: T }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(importFunc());
    }, delay);
  });
};
