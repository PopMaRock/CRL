import { writable, get, type Writable } from 'svelte/store';

export const processing: Writable<boolean> = writable(false);
export const processingQueue: Writable<any[]> = writable([]);

// Helps to manage the cancellations easily
const cancelTokensMap = new Map<string, () => void>();

// Subscribe to changes in the processingQueue to update the processing state
processingQueue.subscribe((queue) => {
    processing.set(queue.length > 0);
});

interface ProcessDetails {
    process: string;
    humanName: string;
    start: number;
    id: string;
}

export async function addProcessToQueue(
    processName: string,
    humanName: string,
    processFn: () => Promise<any>,
    timeout = 10000 // Default timeout is 10 seconds
): Promise<any> {
    const processDetails: ProcessDetails = {
        process: processName,
        humanName,
        start: Date.now(),
        id: `${processName}_${Date.now()}`
    };

    // Check if the process is already in the queue
    const curQueue = get(processingQueue);
    if (curQueue.some((item) => item.process === processName)) {
        console.log(`${humanName} process is already running`);
        return Promise.reject(`${humanName} process is already running`);
    }

    // Function to cancel this process
    const cancelToken = () => {
        processingQueue.update(queue => queue.filter(item => item.id !== processDetails.id));
        cancelTokensMap.delete(processDetails.id);
        console.log('Cancelled:', humanName);
    };

    // Add the process to the queue and store the cancel function
    processingQueue.update(queue => [...queue, processDetails]);
    cancelTokensMap.set(processDetails.id, cancelToken);

    try {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, rejectTimeout) => {
            setTimeout(() => rejectTimeout('Process timed out'), timeout);
        });

        // Race the processing promise against the timeout
        const result = await Promise.race([processFn(), timeoutPromise]);
        return result;
    } catch (error) {
        console.error(`${humanName} Error:`, error);
        throw error;
    } finally {
        // Remove the process from the queue after completing or error
        processingQueue.update(queue => queue.filter(item => item.id !== processDetails.id));
        cancelTokensMap.delete(processDetails.id);
    }
}

export function cancelProcessing(processId: string) {
    const cancelToken = cancelTokensMap.get(processId);
    if (cancelToken) {
        cancelToken();
    }
}