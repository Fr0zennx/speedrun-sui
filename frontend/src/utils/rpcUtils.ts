/**
 * Utility to throttle concurrent asynchronous requests.
 * Useful for preventing rate-limiting on RPC nodes (Chain calls) or network congestion.
 * 
 * @param items Array of items to process
 * @param iterator Async function to process each item
 * @param limit Max number of concurrent executions (default: 4)
 * @returns Array of results in the same order as items
 */
export async function throttleRequests<T, R>(
    items: T[],
    iterator: (item: T) => Promise<R>,
    limit: number = 4
): Promise<R[]> {
    const results: Promise<R>[] = [];
    const executing: Promise<void>[] = [];

    for (const item of items) {
        // Start execution
        const p = Promise.resolve().then(() => iterator(item));
        results.push(p);

        // Track executing promises
        const e = p.then(() => {
            executing.splice(executing.indexOf(e), 1);
        });
        executing.push(e);

        // If limit reached, wait for at least one to finish
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }

    return Promise.all(results);
}
