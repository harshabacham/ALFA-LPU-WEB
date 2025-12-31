import { CreateStudentData, CreateStudentVariables, GetStudentData, GetStudentVariables, UpdateCourseData, UpdateCourseVariables, ListCoursesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateStudent(options?: useDataConnectMutationOptions<CreateStudentData, FirebaseError, CreateStudentVariables>): UseDataConnectMutationResult<CreateStudentData, CreateStudentVariables>;
export function useCreateStudent(dc: DataConnect, options?: useDataConnectMutationOptions<CreateStudentData, FirebaseError, CreateStudentVariables>): UseDataConnectMutationResult<CreateStudentData, CreateStudentVariables>;

export function useGetStudent(vars: GetStudentVariables, options?: useDataConnectQueryOptions<GetStudentData>): UseDataConnectQueryResult<GetStudentData, GetStudentVariables>;
export function useGetStudent(dc: DataConnect, vars: GetStudentVariables, options?: useDataConnectQueryOptions<GetStudentData>): UseDataConnectQueryResult<GetStudentData, GetStudentVariables>;

export function useUpdateCourse(options?: useDataConnectMutationOptions<UpdateCourseData, FirebaseError, UpdateCourseVariables>): UseDataConnectMutationResult<UpdateCourseData, UpdateCourseVariables>;
export function useUpdateCourse(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCourseData, FirebaseError, UpdateCourseVariables>): UseDataConnectMutationResult<UpdateCourseData, UpdateCourseVariables>;

export function useListCourses(options?: useDataConnectQueryOptions<ListCoursesData>): UseDataConnectQueryResult<ListCoursesData, undefined>;
export function useListCourses(dc: DataConnect, options?: useDataConnectQueryOptions<ListCoursesData>): UseDataConnectQueryResult<ListCoursesData, undefined>;
