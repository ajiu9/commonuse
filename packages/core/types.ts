import type { Ref } from 'vue'

export type ShallowUnwrapRef<T> = T extends Ref<infer P> ? P : T

/**
 * Infers the element type of an array
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never
