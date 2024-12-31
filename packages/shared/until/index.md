---
category: Watch
---

# until

Promised one time watch for changes

## Usage

#### Wait for some async data to be ready

```js
import { until, useAsyncState } from '@vueuse/core'

const { state, isReady } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

;(async () => {
  await until(isReady).toBe(true)

  console.log(state) // state is now ready!
})()
```
