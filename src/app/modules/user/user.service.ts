import { User } from "./user.model";

const createStudentIntoDB = async () => {
    // if (await Student.isUserExists(studentData.id)) {
    //     throw new Error(' user already exists!');
    // }
    const result = await User.create(studentData); 
      return result;
};

export const UserService = {
    createStudentIntoDB,
}