export type SortDirection = 'ascending' | 'descending';


export type Key = string | number;
export type Selection = 'all' | Set<Key>;
export type SelectionMode = 'none' | 'single' | 'multiple';
export type LoadingState = 'loading' | 'sorting' | 'loadingMore' | 'error' | 'idle' | 'filtering';
export type Color = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
