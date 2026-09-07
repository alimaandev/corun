self.onmessage = (e: MessageEvent<{ id: string; userCode: string; testCode: string }>) => {
  const { id, userCode, testCode } = e.data

  try {
    const output: string[] = []
    const MAX_OUTPUT = 1000
    const mockConsole = { log: (...args: unknown[]) => { if (output.length < MAX_OUTPUT) output.push(args.map(String).join(' ')) } }

    const fullCode = userCode + '\n' + testCode

    const fn = new Function(
      'console', 'postMessage', 'fetch', 'XMLHttpRequest',
      'importScripts', 'Worker', 'WebSocket', 'BroadcastChannel',
      'self', 'globalThis', 'close', 'setTimeout', 'setInterval',
      'clearTimeout', 'clearInterval', 'requestAnimationFrame',
      'cancelAnimationFrame', 'indexedDB', 'caches', 'Cache',
      'structuredClone', 'queueMicrotask', 'navigator',
      fullCode
    )

    const result = fn(
      mockConsole,
      undefined, undefined, undefined,
      undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined,
      undefined, undefined,
    )

    self.postMessage({ id, success: result === true, error: false, output: output.join('\n') })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    self.postMessage({ id, success: false, error: true, output: msg })
  }
}
