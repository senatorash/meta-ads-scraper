// Simple logging helper functions
export const info = (message: string, data?: any) => {
  console.log(`[INFO]`, message, data ?? "");
};

export const warn = (message: string, data?: any) => {
  console.warn(`[WARN]`, message, data ?? "");
};

export const success = (message: string, data?: any) => {
  console.log(`[SUCCESS]`, message, data ?? "");
};

export const error = (message: string, data?: any) => {
  console.log(`[ERROR]`, message, data ?? "");
};
