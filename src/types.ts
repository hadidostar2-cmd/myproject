export type Subject = 'Maths' | 'Physics' | 'Chemistry' | 'Biology' | 'English' | 'Arabic' | 'French';
export type Grade = '9' | '10' | '11' | '12';
export type Curriculum = 'LS' | 'GS' | 'ES' | 'SAT';
export type Language = 'FR' | 'EN';
export type SessionStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'volunteer' | 'student';
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimeSlot {
  day: Day;
  start: number; // 24h format
  end: number;
}

export interface Volunteer {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  email?: string;
  languages: string[];
  subjects: {
    [key in Grade]?: Subject[];
  };
  availability: TimeSlot[];
  can_problem_solve?: boolean;
  can_review?: boolean;
  target_hours: number;
  actual_hours: number;
  role: 'Member' | 'Organizer' | 'Web Dev';
  description: string;
  avatar?: string;
  color: string;
}

export interface ScheduledSession {
  id: string;
  volunteer_id: string;
  volunteer_name: string;
  volunteer_phone: string;
  volunteer_color: string;
  subject: Subject;
  grade: Grade;
  curriculum?: Curriculum;
  language?: Language;
  day: Day;
  start: number;
  end: number;
  status: SessionStatus;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  type: 'blog' | 'event';
  event_date?: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  type: 'review' | 'problem_solving';
  subject: Subject;
  grade: Grade;
  curriculum?: Curriculum;
  language?: Language;
  uploaded_by: string;
  author_name?: string;
  created_at: string;
}
