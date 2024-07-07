import { UserService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  const result = await UserService.createStudentIntoDB(
    req.file,
    password,
    studentData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student create successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  const result = await UserService.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty create successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: facultyData } = req.body;
  const result = await UserService.createAdminIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin create successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await UserService.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get myself successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user status change successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
