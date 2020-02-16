export class Project {
    projectName : string;
    clientName: string;
    projectManager: string;
    task : [{
        taskName: string;
        assignedTeam: string;
        assignedUser: string;
        taskStatus: string;
        taskDuration: number;
        taskStartDate: Date;
        taskEndDate: Date;
    }];
    cost: number;
    priority: number;
    projectStatus: string;
    projectDuration: number;
    projectStartDate: Date;
    projectEndDate: Date;
    progress: number;
}

