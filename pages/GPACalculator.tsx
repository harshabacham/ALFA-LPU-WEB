import React, { useState, useEffect } from 'react';
import { 
  Calculator, Plus, Trash2, RefreshCw, Award, Info, 
  HelpCircle, ChevronRight, TrendingUp, Compass, BookOpen, CheckCircle
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  credits: number;
  marks: number;
  grade: string; // "O", "A+", "A", "B+", "B", "C", "D", "E", "F"
}

interface Semester {
  id: string;
  name: string;
  sgpa: number;
  credits: number;
}

const GRADE_POINTS: Record<string, number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'D': 4,
  'E': 3,
  'F': 0,
};

const GRADE_DESCRIPTIONS: Record<string, string> = {
  'O': 'Outstanding',
  'A+': 'Excellent',
  'A': 'Very Good',
  'B+': 'Good',
  'B': 'Above Average',
  'C': 'Average',
  'D': 'Pass',
  'E': 'Marginal Fail / Reappear',
  'F': 'Fail',
};

const getGradeFromMarks = (marks: number): string => {
  if (marks >= 90) return 'O';
  if (marks >= 80) return 'A+';
  if (marks >= 70) return 'A';
  if (marks >= 60) return 'B+';
  if (marks >= 50) return 'B';
  if (marks >= 45) return 'C';
  if (marks >= 40) return 'D';
  if (marks >= 30) return 'E';
  return 'F';
};

const getMarksFromGrade = (grade: string): number => {
  switch (grade) {
    case 'O': return 95;
    case 'A+': return 85;
    case 'A': return 75;
    case 'B+': return 65;
    case 'B': return 55;
    case 'C': return 47;
    case 'D': return 42;
    case 'E': return 35;
    case 'F': return 20;
    default: return 85;
  }
};

export const GPACalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tgpa' | 'cgpa' | 'target' | 'reference'>('tgpa');

  // TGPA Calculator States
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('gpa_courses');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return parsed.map((course: any) => {
          const marks = course.marks !== undefined ? course.marks : getMarksFromGrade(course.grade || 'O');
          const grade = getGradeFromMarks(marks);
          return {
            ...course,
            marks,
            grade
          };
        });
      } catch (e) { console.error(e); }
    }
    return [
      { id: '1', name: 'Course 1', credits: 4, marks: 95, grade: 'O' },
      { id: '2', name: 'Course 2', credits: 3, marks: 85, grade: 'A+' },
      { id: '3', name: 'Course 3', credits: 3, marks: 75, grade: 'A' },
      { id: '4', name: 'Course 4', credits: 2, marks: 65, grade: 'B+' },
    ];
  });

  // CGPA Calculator States
  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem('gpa_semesters');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: '1', name: 'Semester 1', sgpa: 8.5, credits: 20 },
      { id: '2', name: 'Semester 2', sgpa: 8.8, credits: 22 },
    ];
  });

  // Quick CGPA States (Method 2)
  const [currentCgpa, setCurrentCgpa] = useState<number>(8.2);
  const [completedCredits, setCompletedCredits] = useState<number>(40);
  const [newSgpa, setNewSgpa] = useState<number>(9.0);
  const [newCredits, setNewCredits] = useState<number>(20);

  // Target GPA Planner States
  const [targetCgpa, setTargetCgpa] = useState<number>(8.5);
  const [targetPlannerCgpa, setTargetPlannerCgpa] = useState<number>(8.0);
  const [targetCompletedCredits, setTargetCompletedCredits] = useState<number>(45);
  const [targetFutureCredits, setTargetFutureCredits] = useState<number>(20);

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem('gpa_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('gpa_semesters', JSON.stringify(semesters));
  }, [semesters]);

  // Calculations: TGPA
  const calculateTGPA = () => {
    let totalCredits = 0;
    let weightedPoints = 0;

    courses.forEach(course => {
      const credits = Number(course.credits) || 0;
      const gradeVal = GRADE_POINTS[course.grade] ?? 0;
      totalCredits += credits;
      weightedPoints += (credits * gradeVal);
    });

    return {
      tgpa: totalCredits > 0 ? (weightedPoints / totalCredits) : 0,
      totalCredits
    };
  };

  const { tgpa, totalCredits: tgpaCredits } = calculateTGPA();

  // Calculations: CGPA from Semesters
  const calculateCGPAFromSemesters = () => {
    let totalCredits = 0;
    let weightedSgpaSum = 0;

    semesters.forEach(sem => {
      const credits = Number(sem.credits) || 0;
      const sgpaVal = Number(sem.sgpa) || 0;
      totalCredits += credits;
      weightedSgpaSum += (sgpaVal * credits);
    });

    return {
      cgpa: totalCredits > 0 ? (weightedSgpaSum / totalCredits) : 0,
      totalCredits
    };
  };

  const { cgpa: calculatedCgpa, totalCredits: cgpaCredits } = calculateCGPAFromSemesters();

  // Calculations: Quick CGPA (Current CGPA + New Semester)
  const quickCgpaResult = (() => {
    const currentCompleted = Number(completedCredits) || 0;
    const currentGPA = Number(currentCgpa) || 0;
    const addedSgpa = Number(newSgpa) || 0;
    const addedCredits = Number(newCredits) || 0;

    const totalCompleted = currentCompleted + addedCredits;
    const totalPoints = (currentGPA * currentCompleted) + (addedSgpa * addedCredits);

    return {
      cgpa: totalCompleted > 0 ? (totalPoints / totalCompleted) : 0,
      totalCredits: totalCompleted
    };
  })();

  // Calculations: Target GPA Planner
  const targetPlannerResult = (() => {
    const curCgpa = Number(targetPlannerCgpa) || 0;
    const completed = Number(targetCompletedCredits) || 0;
    const future = Number(targetFutureCredits) || 0;
    const target = Number(targetCgpa) || 0;

    const totalCreditsSum = completed + future;
    const currentPoints = curCgpa * completed;
    const requiredTotalPoints = target * totalCreditsSum;
    const requiredFuturePoints = requiredTotalPoints - currentPoints;

    const requiredGPA = future > 0 ? (requiredFuturePoints / future) : 0;

    return {
      requiredGPA,
      isPossible: requiredGPA <= 10 && requiredGPA >= 0,
      tooHigh: requiredGPA > 10,
      tooLow: requiredGPA < 0,
      totalCreditsSum
    };
  })();

  // TGPA Helper Actions
  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: `Course ${courses.length + 1}`,
      credits: 3,
      marks: 95,
      grade: 'O'
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, key: keyof Course, value: any) => {
    setCourses(courses.map(course => {
      if (course.id === id) {
        if (key === 'marks') {
          const marksVal = Math.min(100, Math.max(0, parseInt(value) || 0));
          return { 
            ...course, 
            marks: marksVal, 
            grade: getGradeFromMarks(marksVal) 
          };
        }
        return { ...course, [key]: value };
      }
      return course;
    }));
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const clearCourses = () => {
    setCourses([{ id: Date.now().toString(), name: 'Course 1', credits: 3, marks: 95, grade: 'O' }]);
  };

  // CGPA Helper Actions
  const addSemester = () => {
    const newSem: Semester = {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      sgpa: 8.0,
      credits: 20
    };
    setSemesters([...semesters, newSem]);
  };

  const updateSemester = (id: string, key: keyof Semester, value: any) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === id) {
        return { ...sem, [key]: value };
      }
      return sem;
    }));
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(sem => sem.id !== id));
    }
  };

  const clearSemesters = () => {
    setSemesters([{ id: Date.now().toString(), name: 'Semester 1', sgpa: 8.0, credits: 20 }]);
  };

  // Auto-fill active TGPA into CGPA semesters
  const importTGPAToCgpa = () => {
    const newSem: Semester = {
      id: Date.now().toString(),
      name: `Imported Sem (TGPA: ${tgpa.toFixed(2)})`,
      sgpa: parseFloat(tgpa.toFixed(2)),
      credits: tgpaCredits
    };
    setSemesters([...semesters, newSem]);
    setActiveTab('cgpa');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider font-display">
            <Calculator size={12} />
            <span>Academic Performance Suite</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight uppercase leading-none font-display">
            GPA & CGPA <span className="text-primary-500">Calculator</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm md:text-base max-w-xl">
            Accurately estimate, plan, and analyze your semester TGPA, cumulative CGPA, and target requirements following LPU credit grade points.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="grid grid-cols-2 lg:flex lg:flex-row gap-2 p-1.5 bg-sand-50/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/20 w-full lg:max-w-fit">
        {[
          { id: 'tgpa', label: 'TGPA / SGPA', desc: 'Calculate Semester' },
          { id: 'cgpa', label: 'CGPA Accumulator', desc: 'Combine Semesters' },
          { id: 'target', label: 'Target GPA Planner', desc: 'Forecast Requirements' },
          { id: 'reference', label: 'Grade Points Guide', desc: 'LPU Mappings Reference' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-start px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-left transition-all cursor-pointer w-full lg:w-auto ${
              activeTab === tab.id
                ? 'bg-white dark:bg-zinc-800 text-primary-600 dark:text-primary-400 shadow-md border-b-2 border-primary-500'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/40 dark:hover:bg-zinc-900/30'
            }`}
          >
            <span className="text-xs font-bold tracking-tight uppercase font-display">{tab.label}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Primary Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Calculator Workspace */}
        <div className="lg:col-span-8 space-y-6">

          {/* PANEL 1: TGPA / SGPA CALCULATOR */}
          {activeTab === 'tgpa' && (
            <div className="bg-white dark:bg-zinc-900/80 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-display">Semester Course Worksheets</h3>
                    <p className="text-xs text-zinc-400">Add course names, credit weights, and marks (0-100) to auto-calculate grades.</p>
                  </div>
                </div>
                <button
                  onClick={clearCourses}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <RefreshCw size={12} />
                  <span>Reset Table</span>
                </button>
              </div>

              {/* Courses Grid/List */}
              <div className="space-y-3">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  <div className="col-span-5">Course / Subject Title</div>
                  <div className="col-span-3 text-center">Credit Hours</div>
                  <div className="col-span-3 text-center">Marks Scored (0-100)</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                  {courses.map((course, idx) => (
                    <div 
                      key={course.id} 
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center bg-sand-50/50 dark:bg-zinc-900/40 border border-zinc-200/30 dark:border-zinc-800/20 p-3 sm:p-4 rounded-2xl group transition-all hover:border-indigo-500/20"
                    >
                      {/* Name input */}
                      <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-zinc-400 select-none w-5">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                          placeholder="e.g. CSE310 - Database Management"
                          className="w-full bg-transparent text-sm font-semibold text-zinc-800 dark:text-white outline-none border-b border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 focus:border-indigo-500 transition-all py-0.5"
                        />
                      </div>

                      {/* Credits slider / field */}
                      <div className="col-span-5 sm:col-span-3 flex items-center justify-center gap-1.5 sm:gap-2">
                        <span className="sm:hidden text-[11px] font-bold text-zinc-400 mr-auto font-display">Cr:</span>
                        <input
                          type="number"
                          min="1"
                          max="8"
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, 'credits', Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-12 sm:w-16 bg-white dark:bg-zinc-800 text-center py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                        <span className="text-[10px] sm:text-xs text-zinc-400 font-medium shrink-0">LPU Cr</span>
                      </div>

                      {/* Marks Input */}
                      <div className="col-span-5 sm:col-span-3 flex items-center justify-center gap-1.5 sm:gap-2">
                        <span className="sm:hidden text-[11px] font-bold text-zinc-400 mr-auto font-display">Marks:</span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={course.marks}
                            onChange={(e) => updateCourse(course.id, 'marks', e.target.value)}
                            className="w-12 sm:w-16 bg-white dark:bg-zinc-800 text-center py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            placeholder="Marks"
                          />
                          <span className="text-[10px] sm:text-xs font-bold text-primary-500 dark:text-primary-400 bg-primary-500/10 dark:bg-primary-500/5 px-1.5 sm:px-2.5 py-1 rounded-lg border border-primary-500/20 shadow-sm" title={`Grade: ${course.grade} (${GRADE_DESCRIPTIONS[course.grade]})`}>
                            {course.grade}
                          </span>
                        </div>
                      </div>

                      {/* Delete */}
                      <div className="col-span-2 sm:col-span-1 flex justify-end sm:justify-center">
                        <button
                          onClick={() => removeCourse(course.id)}
                          disabled={courses.length <= 1}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 disabled:opacity-30 disabled:pointer-events-none transition-colors rounded-lg hover:bg-rose-50/50 dark:hover:bg-rose-950/20 cursor-pointer"
                          title="Remove Course"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <button
                  onClick={addCourse}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add New Subject</span>
                </button>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={importTGPAToCgpa}
                    className="flex-grow sm:flex-grow-0 inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary-500/10 transition-all cursor-pointer font-display"
                  >
                    <span>Send to CGPA Accumulator</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PANEL 2: CGPA ACCUMULATOR */}
          {activeTab === 'cgpa' && (
            <div className="space-y-6">
              
              {/* Method 1: Detailed Semester Addition */}
              <div className="bg-white dark:bg-zinc-900/80 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-display">Method A: Calculate with Semesters</h3>
                      <p className="text-xs text-zinc-400">Combine all sem SGPA/TGPA and cumulative credit weights to calculate exact CGPA.</p>
                    </div>
                  </div>
                  <button
                    onClick={clearSemesters}
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-rose-500 transition-colors"
                  >
                    <RefreshCw size={12} />
                    <span>Reset Table</span>
                  </button>
                </div>

                {/* Semesters Table */}
                <div className="space-y-3">
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    <div className="col-span-5">Semester Name</div>
                    <div className="col-span-3 text-center">Completed Credits</div>
                    <div className="col-span-3 text-center">Term SGPA / TGPA</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>

                  <div className="space-y-3">
                    {semesters.map((sem, idx) => (
                      <div 
                        key={sem.id} 
                        className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center bg-sand-50/50 dark:bg-zinc-900/40 border border-zinc-200/30 dark:border-zinc-800/20 p-3 sm:p-4 rounded-2xl group transition-all hover:border-emerald-500/20"
                      >
                        {/* Name input */}
                        <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-zinc-400 select-none w-5">
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            value={sem.name}
                            onChange={(e) => updateSemester(sem.id, 'name', e.target.value)}
                            placeholder="e.g. Semester 1"
                            className="w-full bg-transparent text-sm font-semibold text-zinc-800 dark:text-white outline-none border-b border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 focus:border-emerald-500 transition-all py-0.5"
                          />
                        </div>

                        {/* Semester Credits completed */}
                        <div className="col-span-5 sm:col-span-3 flex items-center justify-center gap-1.5 sm:gap-2">
                          <span className="sm:hidden text-[11px] font-bold text-zinc-400 mr-auto font-display">Credits:</span>
                          <input
                            type="number"
                            min="1"
                            max="40"
                            value={sem.credits}
                            onChange={(e) => updateSemester(sem.id, 'credits', Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-12 sm:w-16 bg-white dark:bg-zinc-800 text-center py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          />
                          <span className="text-[10px] sm:text-xs text-zinc-400 font-medium shrink-0">Credits</span>
                        </div>

                        {/* Semester SGPA */}
                        <div className="col-span-5 sm:col-span-3 flex items-center justify-center gap-1.5 sm:gap-2">
                          <span className="sm:hidden text-[11px] font-bold text-zinc-400 mr-auto font-display">SGPA:</span>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            value={sem.sgpa}
                            onChange={(e) => updateSemester(sem.id, 'sgpa', Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)))}
                            className="w-16 sm:w-20 bg-white dark:bg-zinc-800 text-center py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold text-primary-500 dark:text-primary-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          />
                          <span className="text-[10px] sm:text-xs text-zinc-400 font-medium shrink-0">SGPA</span>
                        </div>

                        {/* Delete */}
                        <div className="col-span-2 sm:col-span-1 flex justify-end sm:justify-center">
                          <button
                            onClick={() => removeSemester(sem.id)}
                            disabled={semesters.length <= 1}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 disabled:opacity-30 disabled:pointer-events-none transition-colors rounded-lg hover:bg-rose-50/50 dark:hover:bg-rose-950/20 cursor-pointer"
                            title="Remove Semester"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={addSemester}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Semester Row</span>
                  </button>
                </div>
              </div>

              {/* Method 2: Quick Current CGPA + New term estimate */}
              <div className="bg-white dark:bg-zinc-900/80 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/60 pb-5">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-display">Method B: Quick Accumulator (Current CGPA + New Sem)</h3>
                    <p className="text-xs text-zinc-400">Quickly estimate overall CGPA by adding your current stats to your expected semester TGPA.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Current CGPA</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      value={currentCgpa}
                      onChange={(e) => setCurrentCgpa(Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-full bg-sand-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-750 text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Completed Credits</label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={completedCredits}
                      onChange={(e) => setCompletedCredits(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-sand-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-750 text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">New Term SGPA</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      value={newSgpa}
                      onChange={(e) => setNewSgpa(Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-full bg-sand-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-750 text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">New Term Credits</label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={newCredits}
                      onChange={(e) => setNewCredits(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-sand-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-750 text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PANEL 3: TARGET GPA PLANNER */}
          {activeTab === 'target' && (
            <div className="bg-white dark:bg-zinc-900/80 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/60 pb-5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-display">Target CGPA Requirement Planner</h3>
                  <p className="text-xs text-zinc-400">Determine exactly what SGPA you need in future semesters to reach your target CGPA goal.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Your Current CGPA</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      value={targetPlannerCgpa}
                      onChange={(e) => setTargetPlannerCgpa(Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-full bg-sand-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-750 text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Completed Credits so far</label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={targetCompletedCredits}
                      onChange={(e) => setTargetCompletedCredits(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-sand-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-750 text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Desired TARGET CGPA Goal</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      value={targetCgpa}
                      onChange={(e) => setTargetCgpa(Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-full bg-sand-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-750 text-sm font-bold text-primary-500 dark:text-primary-400 focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Future / Next Semester Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={targetFutureCredits}
                      onChange={(e) => setTargetFutureCredits(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-sand-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-750 text-sm font-bold text-zinc-800 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-sand-50/50 dark:bg-zinc-950/40 p-6 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Target Results</span>
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">Required Future Term SGPA</h4>
                  </div>

                  {targetPlannerResult.isPossible ? (
                    <div className="space-y-2">
                      <div className="text-4xl md:text-5xl font-black text-emerald-500 tracking-tight font-display">
                        {targetPlannerResult.requiredGPA.toFixed(2)}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle size={10} />
                        <span>Highly Achievable!</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 px-4 mt-2">
                        You need to score an SGPA of <strong>{targetPlannerResult.requiredGPA.toFixed(2)}</strong> or more on your upcoming <strong>{targetFutureCredits} credits</strong> to pull your CGPA up to <strong>{targetCgpa.toFixed(2)}</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl md:text-5xl font-black text-rose-500 tracking-tight font-display">
                        {targetPlannerResult.requiredGPA.toFixed(2)}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-wider">
                        <span>Unachievable mathematically</span>
                      </div>
                      <p className="text-xs text-rose-500 dark:text-rose-400/90 px-4 mt-2">
                        {targetPlannerResult.tooHigh 
                          ? `This is higher than the maximum grade point threshold (10.00). Try lowering your target CGPA or planning over a higher credit size.`
                          : `The target CGPA is already exceeded by your current standing. Enjoy your excellent performance!`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PANEL 4: REFERENCE GUIDE */}
          {activeTab === 'reference' && (
            <div className="bg-white dark:bg-zinc-900/80 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/60 pb-5">
                <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500 border border-primary-500/20">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-display">LPU Grade Credit Point Mapping</h3>
                  <p className="text-xs text-zinc-400">Official reference for letter grade multipliers used in calculating SGPA & CGPA transcripts.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(GRADE_POINTS).map((gr) => {
                  const points = GRADE_POINTS[gr];
                  const desc = GRADE_DESCRIPTIONS[gr];
                  
                  return (
                    <div 
                      key={gr} 
                      className="bg-sand-50/50 dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-between"
                    >
                      <div className="space-y-1 text-left">
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Grade</span>
                        <div className="text-2xl font-black text-zinc-800 dark:text-white font-display">{gr}</div>
                        <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block truncate max-w-[130px]">{desc}</span>
                      </div>
                      <div className="p-3 bg-primary-500/10 border border-primary-500/25 text-primary-600 dark:text-primary-400 rounded-xl text-center">
                        <span className="block text-[8px] font-bold uppercase tracking-widest font-mono text-zinc-400">Points</span>
                        <span className="text-lg font-black font-display">{points}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-sand-50/50 dark:bg-zinc-950/20 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-2 text-zinc-500 dark:text-zinc-400 text-xs">
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 font-bold font-display">
                  <Info size={14} />
                  <span>How Calculations Work:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed">
                  <li><strong>Single Subject Points:</strong> Subject Grade Points = Course Credits × Grade Point mapping.</li>
                  <li><strong>TGPA (Term Grade Point Average):</strong> Sum of Grade points scored in all courses of a term divided by the total credit count of that term.</li>
                  <li><strong>CGPA (Cumulative Grade Point Average):</strong> Overall average performance calculated across all semesters taken so far weighted by respective sem credits.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Display Live Dynamic Result Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Scoring Showcase Widget */}
          <div className="bg-zinc-950 text-white rounded-[2rem] border border-zinc-800 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl shadow-primary-500/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 font-mono block">Dynamic Assessment Score</span>
              <h3 className="text-xl font-bold font-display tracking-tight text-white">Academic Standings</h3>
            </div>

            {/* Display relevant result based on tab selection */}
            {activeTab === 'tgpa' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/50">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Current Term TGPA</span>
                    <div className="text-5xl font-black text-primary-500 tracking-tighter font-display">
                      {tgpa.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Total Credits</span>
                    <div className="text-2xl font-black text-zinc-200 font-display">
                      {tgpaCredits} <span className="text-xs text-zinc-500">Cr</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between text-xs border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 font-medium">LPU Grade Category:</span>
                    <span className="font-bold text-zinc-200">
                      {tgpa >= 9.0 ? 'Outstanding (Honor Roll)' : tgpa >= 8.0 ? 'First Division with Distinction' : tgpa >= 6.5 ? 'First Division' : tgpa >= 5.0 ? 'Second Division' : 'Satisfactory / Pass'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 font-medium">Equivalent Percentage:</span>
                    <span className="font-bold text-zinc-200">
                      {(tgpa * 10).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cgpa' && (
              <div className="space-y-6">
                
                {/* Method A Result */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 font-mono block text-left">Method A (Semesters Combined)</span>
                  <div className="flex justify-between items-end bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/50">
                    <div className="text-left space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Calculated CGPA</span>
                      <div className="text-5xl font-black text-emerald-500 tracking-tighter font-display">
                        {calculatedCgpa.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Total Sem Credits</span>
                      <div className="text-2xl font-black text-zinc-200 font-display">
                        {cgpaCredits} <span className="text-xs text-zinc-500 font-mono">Cr</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method B Result */}
                <div className="space-y-3 pt-2 border-t border-zinc-900">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 font-mono block text-left">Method B (Quick Mix)</span>
                  <div className="flex justify-between items-end bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/50">
                    <div className="text-left space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Estimated CGPA</span>
                      <div className="text-5xl font-black text-purple-500 tracking-tighter font-display">
                        {quickCgpaResult.cgpa.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Overall Credits</span>
                      <div className="text-2xl font-black text-zinc-200 font-display">
                        {quickCgpaResult.totalCredits} <span className="text-xs text-zinc-500 font-mono">Cr</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-900 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Estimated Percentage (A):</span>
                    <span className="font-bold text-zinc-200">{(calculatedCgpa * 10).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Estimated Percentage (B):</span>
                    <span className="font-bold text-zinc-200">{(quickCgpaResult.cgpa * 10).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'target' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/50">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Target CGPA Goal</span>
                    <div className="text-5xl font-black text-amber-500 tracking-tighter font-display">
                      {targetCgpa.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Total Final Credits</span>
                    <div className="text-2xl font-black text-zinc-200 font-display">
                      {targetPlannerResult.totalCreditsSum} <span className="text-xs text-zinc-500">Cr</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between text-xs border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 font-medium">Target Classification:</span>
                    <span className="font-bold text-zinc-200">
                      {targetCgpa >= 9.0 ? 'Elite Honors Class' : targetCgpa >= 8.0 ? 'First Class Distinction' : targetCgpa >= 6.5 ? 'First Class' : 'Pass Class'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 font-medium">Goal Completion State:</span>
                    <span className={`font-bold ${targetPlannerResult.isPossible ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`}>
                      {targetPlannerResult.isPossible ? 'Mathematically Viable' : 'Unachievable Range'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reference' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/50 space-y-3 text-left">
                  <HelpCircle size={18} className="text-primary-500" />
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Grade mappings are derived from standard academic frameworks utilized by university ERP portals (like LPU e-Connect).
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Always confirm specific criteria updates with official program offices.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Placement Eligibility Guidelines Card */}
          <div className="bg-white dark:bg-zinc-900/85 p-6 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 space-y-4 text-left">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 font-display text-sm uppercase tracking-wider flex items-center gap-2">
              <Compass size={16} className="text-primary-500" />
              <span>Campus Eligibility Tips</span>
            </h4>
            <div className="space-y-3 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Placement Drives:</span>
                <p className="text-[11px] text-zinc-500">Most tier-1 tech recruiters (e.g. Amazon, Cognizant, Capgemini) specify a minimum CGPA of <strong>7.0 to 8.0</strong> with no active backlogs.</p>
              </div>
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Syllabus Honours Tag:</span>
                <p className="text-[11px] text-zinc-500">Graduating with an <strong>Honours</strong> degree typically requires maintaining an overall CGPA of <strong>8.0+</strong> throughout the course cycle.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GPACalculator;
