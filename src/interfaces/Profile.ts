export interface Profile {
    Id: number;
    EMAIL_EMPLOYE: string;
    NAME_EMPLOYEE: string;
    GROUP: string;
    AREA: string;
    EMAIL_1ST_EVALUATOR: string;
    LoginName: string;
    [key: string]: string | number | undefined;
}