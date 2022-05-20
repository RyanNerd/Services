// ORM record of the Resident "Client" table
export type ClientRecord = {
    Created?: null | Date;
    DOB_DAY: number | string;
    DOB_MONTH: number | string;
    DOB_YEAR: number | string;
    FirstName: string;
    HMIS: string;
    Id: null | number;
    LastName: string;
    Nickname: string;
    Notes: string;
    Updated?: null | Date;
    UserId?: number;
    deleted_at?: null | Date;
    [key: string]: unknown;
};

// ORM record of the Document table
export type FileRecord = {
    Created?: null | Date;
    Description: null | string;
    FileName: string;
    Id: null | number;
    Image: null | string;
    MediaType: null | string;
    ResidentId: number;
    Size: null | number;
    Updated?: null | Date;
    [key: string]: unknown;
    deleted_at?: null | Date;
};

// ORM record of the MedHistory table
export type DrugLogRecord = {
    Created?: string | null;
    Id: null | number;
    In: null | number;
    MedicineId: number;
    Notes: null | string;
    Out: null | number;
    PillboxItemId: number | null;
    ResidentId: number;
    Updated?: null | Date;
    [key: string]: unknown;
};

// ORM record of the Medicine table
export type MedicineRecord = {
    Barcode: string | null;
    Directions: string | null;
    Drug: string;
    OtherNames: string;
    FillDateDay?: string | number;
    FillDateMonth?: string;
    FillDateYear?: string | number;
    [key: string]: unknown;
    Id: number | null;
    Notes: string | null;
    Active: boolean;
    OTC: boolean;
    ResidentId?: number | null;
    Strength: string | null;
};

// ORM record of the Pillbox table
export type PillboxRecord = {
    Id: number | null;
    ResidentId: number | null;
    Name: string;
    Notes: string | null;
    [key: string]: unknown;
};

// ORM record of the PillboxItem table
export type PillboxItemRecord = {
    Id: number | null;
    ResidentId: number;
    PillboxId: number;
    MedicineId: number;
    Quantity: number;
};

export type ServiceRecord = {
    Id: number | null;
    ServiceName: string;
    AllowMultiple: boolean;
    HmisId?: null | string;
    Updated?: null | Date;
    Created?: null | Date;
    deleted_at?: null | Date;
};

export type ServiceLogRecord = {
    Id: number | null;
    ResidentId: number;
    ServiceId: number;
    Notes: string;
    DateOfService: Date;
    Recorded?: null | Date;
    Updated?: null | Date;
    Created?: null | Date;
    deleted_at?: null | Date;
};
// Default empty Service record
export const newServiceRecord = {
    Id: null,
    ServiceName: '',
    HmisId: '',
    AllowMultiple: false
} as ServiceRecord;

// Default empty Resident (Client) record
export const newClientRecord = {
    Id: null,
    FirstName: '',
    LastName: '',
    Nickname: '',
    DOB_YEAR: 0,
    DOB_MONTH: 0,
    DOB_DAY: 0,
    Notes: ''
} as ClientRecord;

// Global Client Type for the activeClient
export type TClient = {
    clientInfo: ClientRecord;
    drugLogList: DrugLogRecord[];
    fileList: FileRecord[];
    medicineList: MedicineRecord[];
    pillboxItemList: PillboxItemRecord[];
    pillboxList: PillboxRecord[];
};
