export class Task {
    id: number | undefined;
    name: string | undefined;
    priority: number | undefined;
    status: string | undefined;
}


export enum Status {
    NotStarted = 0,
    InProgress = 1,
    Completed = 2
}

export const EnumMapping: Record<number, string> = {
    [Status.NotStarted]: "Not Started",
    [Status.InProgress]: "In Progress",
    [Status.Completed]: "Completed",
};


