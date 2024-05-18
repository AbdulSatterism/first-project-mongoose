import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    // validation with joi
    // const { error, value } = studentValidationSchema.validate(studentData);

    // implement with zod
    const zodData = studentValidationSchema.parse(studentData);

    const result = await StudentServices.createStudentIntoDB(zodData);

    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: 'something went wrong',
    //     error: error.details,
    //   });
    // }

    res.status(200).json({
      success: true,
      message: 'Student create successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'something went wrong',
      error: err,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: 'get all students successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'something went wrong',
      error: err,
    });
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const id = req.params.studentId;
    const result = await StudentServices.getSingleStudentFromDB(id);
    res.status(200).json({
      success: true,
      message: 'get single student successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'something went wrong',
      error: err,
    });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = req.params.studentId;
    const result = await StudentServices.deleteStudentFromDB(id);
    res.status(200).json({
      success: true,
      message: 'student deleted successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'something went wrong',
      error: err,
    });
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
