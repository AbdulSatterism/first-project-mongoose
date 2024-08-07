/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  //create a user object
  const userData: Partial<TUser> = {};
  //set user given password or default
  userData.password = password || (config.default_password as string);

  userData.role = 'student';
  //set student email
  userData.email = payload.email;

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }

  // find department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Aademic department not found');
  }
  payload.academicFaculty = academicDepartment.academicFaculty;
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

    if (file) {
      const imageName = `${userData?.id}`;
      const path = file?.path;
      //send image to cloudinary
      const profileImg = await sendImageToCloudinary(imageName, path);

      payload.profileImage = profileImg?.secure_url;
    }

    //set id, and user id,and profile image
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

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  const userData: Partial<TUser> = {};
  //set user given password or default
  userData.password = password || (config.default_password as string);
  userData.role = 'faculty';
  //set faculty email
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  payload.academicFaculty = academicDepartment?.academicFaculty;

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

    if (file) {
      const imageName = `${userData?.id}`;
      const path = file?.path;
      const profileImg = await sendImageToCloudinary(imageName, path);
      payload.profileImage = profileImg?.secure_url;
    }

    payload.id = facultyUser[0].id;
    payload.user = facultyUser[0]._id;

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

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  const userData: Partial<TUser> = {};
  //set user given password or default
  userData.password = password || (config.default_password as string);
  userData.role = 'admin';
  //set admin email
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generateAdminId();

    const adminUser = await User.create([userData], { session });
    if (!adminUser?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'faild to user create');
    }

    if (file) {
      const imageName = `${userData?.id}`;
      const path = file?.path;
      const profileImg = await sendImageToCloudinary(imageName, path);
      payload.profileImage = profileImg?.secure_url;
    }

    payload.id = adminUser[0].id;
    payload.user = adminUser[0]._id;

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

const getMe = async (userId: string, role: string) => {
  let result = null;

  if (role === 'student') {
    result = await Student.findOne({ id: userId });
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId });
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId });
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const UserService = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
