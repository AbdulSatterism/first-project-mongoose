import { Student } from '../student.model';
import { TStudent } from './student.interface';

const createStudentIntoDB = async (studentData: TStudent) => {
  // for static method
  if (await Student.isStudentExists(studentData.id)) {
    throw new Error('student already exists');
  }

  const result = await Student.create(studentData); //build in static method

  //make built in instance method
  // const student = new Student(studentData);

  // if (await student.isStudentExists(studentData.id)) {
  //   throw new Error('student already exists');
  // }
  // const result = await student.save();

  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.find({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDelete: true });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
