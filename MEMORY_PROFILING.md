## Memory Profiling with Heap Dumps (Node.js Server)

This guide explains how to generate and analyze heap dumps for the Node.js server process to help diagnose memory leaks.

### 1. Prerequisites
*   Ensure you have developer tools like Chrome browser installed.
*   The application's `dev` script has been updated with `NODE_OPTIONS='--inspect'`.

### 2. Generating Heap Dumps

There are a couple of common ways to generate heap dumps:

**Method A: Using `node-heapdump` (or a similar library)**

If a library like `heapdump` has been integrated (check `package.json` and potentially server startup files like `server.js` or custom Next.js server setups, though often not needed for basic Next.js):

*   **Installation (if not done by the assistant):**
    ```bash
    pnpm install heapdump
    ```
*   **Triggering:** You might need to add code to your custom server logic to trigger dumps, or send a signal. For example, to trigger a dump on a `SIGUSR2` signal, you might add this to your server setup (if you have a custom server):
    ```javascript
    // In your custom server.js (if you have one)
    // const heapdump = require('heapdump'); // Or import if using ESModules
    // process.on('SIGUSR2', function() {
    //   const filename = './' + Date.now() + '.heapsnapshot';
    //   heapdump.writeSnapshot(filename, function(err, filename) {
    //     console.log('Heap dump written to', filename);
    //   });
    // });
    // console.log('PID:', process.pid, 'Send SIGUSR2 to trigger heap dump.');
    ```
    If you don't have a custom server, this approach is harder with Next.js's default server. Proceed to Method B.

**Method B: Using Chrome DevTools (Recommended for standard Next.js setups)**

This method uses the Node.js inspector enabled by `NODE_OPTIONS='--inspect'`.

1.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    Look for a message in the console like `Debugger listening on ws://127.0.0.1:9229/...`. The port `9229` is the default inspect port.

2.  **Connect Chrome DevTools:**
    *   Open Chrome and go to `chrome://inspect`.
    *   You should see your application listed under "Remote Target". Click "inspect".
    *   This will open Chrome DevTools connected to your Node.js process.

3.  **Take Heap Snapshots:**
    *   Go to the **Memory** tab in DevTools.
    *   Ensure "Heap snapshot" is selected.
    *   Click the **"Take snapshot"** button.
    *   To diagnose leaks, you typically take multiple snapshots over time:
        *   Snapshot 1: After the application starts and stabilizes.
        *   Snapshot 2: After performing actions that you suspect cause memory leaks.
        *   Snapshot 3 (and more): After performing more actions or after some time.

### 3. Analyzing Heap Dumps in Chrome DevTools

1.  **Load the Snapshot:** If you generated a `.heapsnapshot` file (e.g., using Method A or by saving a snapshot from DevTools), you can load it in the Memory tab using the "Load" button.

2.  **Comparison View:**
    *   This is the most useful view for finding leaks.
    *   Select a snapshot (e.g., "Snapshot 2") and in the dropdown next to its name, choose "Comparison" with another snapshot (e.g., "Snapshot 1").
    *   Sort by **"Size Delta"** (descending) to see objects that have grown the most in size between snapshots.
    *   Sort by **"Freed Delta"** or **"Alloc. Delta"** to see objects allocated/freed. Objects that are allocated but not freed, and whose count or size delta grows consistently, are leak suspects.

3.  **Retainers View:**
    *   Click on an object in the snapshot view.
    *   In the "Retainers" panel below, you can see the chain of objects that are holding a reference to the selected object, preventing it from being garbage collected. This helps you trace back *why* an object is still in memory.
    *   Look for unexpected retainers or chains that shouldn't exist.

4.  **Common things to look for:**
    *   **Detached DOM elements** (more for client-side, but can appear in SSR contexts if not careful).
    *   **Large arrays or objects** that grow over time.
    *   **Closures** holding onto large amounts of data.
    *   Objects related to event listeners, timers, or subscriptions that haven't been cleaned up.

By comparing snapshots and examining retainers, you can identify objects that are accumulating and trace the cause of the memory leak.

## Additional Memory Profiling Tools & Techniques

Beyond heap dumps with Chrome DevTools, other tools and techniques can help diagnose memory leaks on both the server and client side.

### Server-Side (Node.js) Profiling

1.  **Node.js Built-in Profiler (`--prof`):**
    *   **Usage:** Run your application with the `--prof` flag:
        ```bash
        NODE_OPTIONS='--prof' pnpm run dev
        ```
    *   This generates a `isolate-0x...-v8.log` file in your project root.
    *   **Processing the log:**
        ```bash
        node --prof-process isolate-0x...-v8.log > processed-profile.txt
        ```
    *   **Analysis:** The output `processed-profile.txt` shows where your application spends its time. While primarily for CPU profiling, it can reveal excessive GC activity or functions that might be memory intensive.

2.  **Clinic.js (`clinic heap-profiler`):**
    *   **Installation:**
        ```bash
        pnpm install clinic
        ```
    *   **Usage:**
        ```bash
        clinic heap-profiler -- node server.js # (If you have a custom server)
        # Or for Next.js, you might need to profile the Next.js process directly:
        clinic heap-profiler -- pnpm run dev
        ```
        (Note: Using Clinic.js with Next.js's dev server can sometimes be tricky due to process spawning. It might be more straightforward to use it on a production build `pnpm run build && clinic heap-profiler -- pnpm run start` or by identifying the specific Node process to attach to if `pnpm run dev` spawns multiple.)
    *   **Analysis:** Clinic.js generates an HTML report visualizing potential memory issues and helping to pinpoint allocation hotspots.

3.  **`memwatch-next` (Programmatic):**
    *   **Installation:**
        ```bash
        pnpm install memwatch-next
        ```
    *   **Usage:** This library is used programmatically within your code.
        ```javascript
        // Example: In a custom server or a specific module you suspect
        // const memwatch = require('memwatch-next');

        // memwatch.on('leak', (info) => {
        //   console.error('Memory leak detected:', info);
        //   // You can also trigger heap dumps here if needed
        // });

        // To get heap diffs:
        // const hd = new memwatch.HeapDiff();
        // // ... perform some actions ...
        // const diff = hd.end();
        // console.log('Heap diff:', JSON.stringify(diff, null, 2));
        ```
    *   **Analysis:** Useful for continuous monitoring in development or for getting detailed heap diffs after specific operations.

### Client-Side (Browser) Profiling

Use your browser's developer tools (e.g., Chrome DevTools) for these.

1.  **Chrome DevTools - Memory Tab (Recap & More):**
    *   **Heap Snapshots:** Already covered for Node.js, but equally crucial for client-side JS. Take snapshots of the browser's JS heap before and after interactions. Compare them to find detached DOM nodes, leaked objects, etc.
    *   **Allocation instrumentation on timeline:**
        *   Go to the **Performance** tab.
        *   Click the "Record" button.
        *   Perform actions in your UI.
        *   Stop recording.
        *   In the timeline, look for blue bars indicating JS heap size. If it grows consistently without dropping, it's a sign of a leak.
        *   Enable the "Memory" checkbox in the Performance tab settings to see more details. Analyze the call stacks for allocations.
    *   **Allocation sampling:**
        *   In the **Memory** tab, select "Allocation sampling".
        *   Record actions. This profiles memory allocations with lower overhead than the timeline method. It helps identify functions responsible for allocations.

2.  **React DevTools Profiler:**
    *   **Installation:** Add the React DevTools browser extension.
    *   **Usage:**
        *   Open React DevTools in your browser's developer tools.
        *   Go to the "Profiler" tab.
        *   Click "Record" and interact with your application.
        *   Stop recording.
    *   **Analysis:** The profiler shows which components re-rendered, why, and how long they took. While not a direct memory leak tool, it helps identify performance bottlenecks. Unnecessary re-renders can sometimes contribute to or mask memory issues. Look for components that render too often or take too long.

3.  **`performance.memory` API (Programmatic):**
    *   **Usage:** In your client-side JavaScript, you can periodically log heap size:
        ```javascript
        // Example: In a utility function or a debug component
        // if (performance.memory) {
        //   console.log('Used JS Heap Size:', performance.memory.usedJSHeapSize / (1024 * 1024), 'MB');
        //   console.log('Total JS Heap Size:', performance.memory.totalJSHeapSize / (1024 * 1024), 'MB');
        // }
        ```
    *   **Analysis:** Log this over time during specific user flows to see if `usedJSHeapSize` consistently increases without bound.

### General Tips for Profiling
*   **Reproduce consistently:** Try to find a set of actions that reliably reproduces the suspected memory leak.
*   **Isolate:** Test specific components or pages in isolation if possible. Next.js allows for creating minimal test pages.
*   **Disable browser extensions:** Some browser extensions can interfere with profiling or add noise to snapshots. Use an incognito window or a clean browser profile.
*   **Force garbage collection:** In Chrome DevTools (Memory or Performance tabs), there's often a "Collect garbage" button (looks like a trash can). Use this before taking heap snapshots to ensure you're only seeing objects that couldn't be GC'd.

## Analyzing Application Logs for Memory Leaks

Application logs can provide crucial context when diagnosing memory leaks by highlighting errors, unusual behavior, or resource-intensive operations that correlate with memory growth. This application uses Pino logger for server-side logging and a console wrapper for client-side.

### Key Log Locations & What to Monitor:

1.  **Server-Side Error Log (`logs/errors.log`):**
    *   **Location:** `logs/errors.log` (relative to the project root).
    *   **Content:** Contains server-side errors of level `error` and above.
    *   **What to look for:**
        *   **Recurring errors:** Errors that appear frequently, especially if their appearance coincides with increased server memory usage.
        *   **Errors from specific modules/APIs:** If errors consistently originate from particular parts of your application (e.g., a specific API route, a database interaction, a third-party service call), these areas might be involved in a leak.
        *   **Resource exhaustion errors:** While not always present, look for any explicit out-of-memory errors, database connection pool exhaustion, file handle limits exceeded, etc.
        *   **Contextual information:** The logs include a `context` field. Pay attention to any IDs (user, session, request, resource) that might help pinpoint the operation causing issues.

2.  **Server-Side Console Logs (Development):**
    *   **Output:** Your terminal console when running `pnpm run dev`.
    *   **Content:** In development, logs at `debug` level, providing a verbose trace of server activity.
    *   **What to look for:**
        *   **Excessive logging for an operation:** If a simple action triggers an unexpectedly large number of log entries, it might indicate an inefficient process or loop.
        *   **Repeated patterns:** Look for sequences of logs that repeat more often than expected.
        *   **Correlation with actions:** Observe these logs while performing actions you suspect are leaky. Note any unusual log activity.

3.  **Client-Side Browser Console Logs:**
    *   **Output:** Your browser's Developer Tools Console.
    *   **Content:** Logs from client-side operations and any errors caught by the client-side error handler.
    *   **What to look for:**
        *   **Errors during UI interactions:** Similar to server logs, note errors that occur when interacting with specific UI components.
        *   **Warnings about component lifecycles:** React might log warnings about state updates on unmounted components (which we've identified as areas to fix). While not direct leaks, they can be symptoms of related issues.
        *   **Log output from `performance.memory`:** If you've implemented this (as suggested in other profiling sections), track the JS heap size logged here.

### How to Use Logs with Profiling Tools:

1.  **Start with a Baseline:** Ensure your application is in a stable state. Clear logs if possible, or note the current time.
2.  **Begin Profiling & Logging:**
    *   Start your chosen memory profiling tool (e.g., taking heap snapshots, starting allocation profiling).
    *   Ensure your application's logging (both server and client as needed) is active and accessible.
3.  **Perform Suspected Leaky Actions:** Execute the user flows or operations that you believe are causing memory to increase.
4.  **Observe and Correlate:**
    *   Monitor memory usage charts from your profiler.
    *   Simultaneously, watch the application logs.
    *   Note the timestamps of significant log entries (especially errors or warnings) and see if they correspond to jumps in memory usage or the appearance of new, un-freed objects in your heap snapshots.
5.  **Analyze Post-Mortem:** After stopping the profiling session, carefully review the collected logs alongside your profiling data (e.g., heap snapshots).
    *   Filter logs by timestamps corresponding to periods of high memory allocation or when specific objects were identified as leaking in heap snapshots.
    *   Look for logged errors or unusual activity that could explain *why* those objects are being retained or over-allocated.

By systematically combining log analysis with memory profiling data, you can build a stronger case for where and why memory leaks are occurring.
