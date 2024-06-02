import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Faculty } from '../faculty/faculty.model';
import { TFaculty } from '../faculty/faculty.interface';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};
  //set user given password or default
  userData.password = password || (config.default_password as string);

  userData.role = 'student';

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }

  // create session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //generate id
    userData.id = await generateStudentId(admissionSemester);

    //create a user transection-1
    const newUser = await User.create([userData], { session });

    //user check
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create user');
    }
    //set id, and user id
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference id

    //create a user transection-2
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create student');
    }

    // after success
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};
  //set user given password or default
  userData.password = password || (config.default_password as string);
  userData.role = 'faculty';

  // create session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyId();

    const facultyUser = await User.create([userData], { session });

    if (!facultyUser.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'failed to create user for faculty',
      );
    }

    payload.id = facultyUser[0].id;
    payload.user = facultyUser[0]._id;
    payload.role = facultyUser[0].role;

    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {};
  //set user given password or default
  userData.password = password || (config.default_password as string);
  userData.role = 'admin';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generateAdminId();

    const adminUser = await User.create([userData], { session });
    if (!adminUser?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'faild to user create');
    }
    payload.id = adminUser[0].id;
    payload.user = adminUser[0]._id;
    payload.role = adminUser[0].role;

    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to admin create');
    }

    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserService = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
