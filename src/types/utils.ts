/**
 * Use only for components.
 * Unused, use ComponentProps<typeof SomeComponent> instead.
 */
export type InferProps<T> = T extends (props: infer P) => JSX.Element ? P : never;
