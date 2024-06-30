/** use only for components */
export type InferProps<T> = T extends (props: infer P) => JSX.Element ? P : never;
