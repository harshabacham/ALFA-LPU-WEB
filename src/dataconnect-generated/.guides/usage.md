# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateStudent, useGetStudent, useUpdateCourse, useListCourses } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateStudent(createStudentVars);

const { data, isPending, isSuccess, isError, error } = useGetStudent(getStudentVars);

const { data, isPending, isSuccess, isError, error } = useUpdateCourse(updateCourseVars);

const { data, isPending, isSuccess, isError, error } = useListCourses();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createStudent, getStudent, updateCourse, listCourses } from '@dataconnect/generated';


// Operation CreateStudent:  For variables, look at type CreateStudentVars in ../index.d.ts
const { data } = await CreateStudent(dataConnect, createStudentVars);

// Operation GetStudent:  For variables, look at type GetStudentVars in ../index.d.ts
const { data } = await GetStudent(dataConnect, getStudentVars);

// Operation UpdateCourse:  For variables, look at type UpdateCourseVars in ../index.d.ts
const { data } = await UpdateCourse(dataConnect, updateCourseVars);

// Operation ListCourses: 
const { data } = await ListCourses(dataConnect);


```