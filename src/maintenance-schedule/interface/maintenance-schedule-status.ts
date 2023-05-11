export enum MaintenanceStatusEnum {
    Cancel = "cancel",
    Waiting = "waiting",
    Coming = "coming",
    Done = "done",
    Received = "received"
}

export enum StatusHistory {
    create = 'create',
    update = 'update',
    delete = 'delete',
    addRelate = 'addRelate',
    removeRelate = 'removeRelate',
}

export const MAINTENANCE_STATUS_ENUM = {
    Cancel: {
        name : "Cancel",
        name_vn : "Đã hủy",
        description: "",
        color: "FF00D279",
    },
    Processing: {
        name : "Waiting",
        name_vn : "Đã đang xử lý",
        description: "",
        color: "FF6A0000",
    },
    Coming: {
        name : "Coming",
        name_vn : "Đang trên đường đến",
        description: "",
        color: "FF00A9BB",
    },
    Done: {
        name : "Done",
        name_vn : "Đã xong",
        description: "",
        color: "FF00D279",
    },
    Received: {
        name : "Received",
        name_vn : "Đã nhận",
        description: "",
        color: "FF00D279",
    }
}
