export type TUser = {
    is:string;
    password:string;
    needsPasswordChange:boolean;
    role:'admin'|'student'|'faculty';
    isAdmin:boolean;
}