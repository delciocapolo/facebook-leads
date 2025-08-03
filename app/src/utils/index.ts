export function isDefined(value: unknown): boolean {
   return typeof value !== "undefined" && value && value !== null ? true : false;
}

/**
 * 
 * @param args Array<() => Promise<any>>
 * @returns 
 * @example
 * resolveSequencialPromises(
 *    () => Promise.resolve(true),
 *    () => Promise.resolve(false),
 *    () => Promise.resolve("Delcio Capolo"),
 * );
 */
export async function resolveSequencialPromises(...args: Array<() => Promise<any>>) {
   type TypeResult = {
      name: string;
      status: boolean;
      error?: any;
      value?: any;
   }

   const results: TypeResult[] = [];

   for (const task of args) {
      const name = task.name || 'anonymous';
      try {
         const result = await task();
         results.push({
            name: name,
            status: true,
            value: result,
         });
      } catch (error) {
         results.push({
            name: name,
            status: false,
            error: error,
         })
      }
   }

   return results;
}