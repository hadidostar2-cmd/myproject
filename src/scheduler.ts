import { Volunteer, ScheduledSession, Grade, Subject, Day } from './types';

const SCIENTIFIC_SUBJECTS: Subject[] = ['Maths', 'Physics', 'Chemistry', 'Biology'];
const ALL_SUBJECTS: Subject[] = ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Arabic', 'French'];
const GRADES: Grade[] = ['12', '11', '10', '9'];
const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function generateSchedule(volunteers: Volunteer[]): ScheduledSession[] {
  const schedule: ScheduledSession[] = [];
  const volunteerHoursUsed: Record<string, number> = {};
  volunteers.forEach(v => volunteerHoursUsed[v.id] = 0);

  // Helper to check if a volunteer is available at a specific time
  const isVolunteerAvailable = (volunteer: Volunteer, day: Day, start: number, end: number) => {
    const hasAvailability = volunteer.availability.some(slot => 
      slot.day === day && slot.start <= start && slot.end >= end
    );
    if (!hasAvailability) return false;

    const hasClash = schedule.some(session => 
      session.volunteer_id === volunteer.id && 
      session.day === day && 
      ((start >= session.start && start < session.end) || (end > session.start && end <= session.end))
    );
    
    return !hasClash;
  };

  // 1. Mandatory Coverage: Grade 11 & 12 Scientific Subjects
  const mandatoryGrades: Grade[] = ['12', '11'];
  
  for (const grade of mandatoryGrades) {
    for (const subject of SCIENTIFIC_SUBJECTS) {
      const capableVolunteers = volunteers.filter(v => v.subjects[grade]?.includes(subject));
      
      for (const day of DAYS) {
        // Reduce load on weekends
        const isWeekend = day === 'Saturday' || day === 'Sunday';
        const maxSessions = isWeekend ? 2 : 5;
        let sessionsToday = 0;

        for (let hour = 10; hour < 15; hour++) { // Core hours for mandatory
          if (sessionsToday >= maxSessions) break;
          const start = hour;
          const end = hour + 1;

          const availableVolunteer = capableVolunteers
            .filter(v => volunteerHoursUsed[v.id] < v.target_hours + 2) // Allow slight overflow for mandatory
            .sort((a, b) => (volunteerHoursUsed[a.id] / a.target_hours) - (volunteerHoursUsed[b.id] / b.target_hours))
            .find(v => isVolunteerAvailable(v, day, start, end));

          if (availableVolunteer) {
            schedule.push({
              id: Math.random().toString(36).substr(2, 9),
              volunteer_id: availableVolunteer.id,
              volunteer_name: availableVolunteer.name,
              volunteer_phone: availableVolunteer.phone,
              volunteer_color: availableVolunteer.color,
              subject,
              grade,
              day,
              start,
              end,
              status: 'scheduled'
            });
            volunteerHoursUsed[availableVolunteer.id]++;
            sessionsToday++;
          }
        }
      }
    }
  }

  // 2. Fill remaining for other grades and subjects
  for (const grade of GRADES) {
    const subjectsToSchedule = ALL_SUBJECTS;

    for (const subject of subjectsToSchedule) {
      const capableVolunteers = volunteers.filter(v => v.subjects[grade]?.includes(subject));

      for (const day of DAYS) {
        // Reduce load on weekends
        const isWeekend = day === 'Saturday' || day === 'Sunday';
        const maxSessions = isWeekend ? 1 : 3;
        let sessionsToday = 0;

        for (let hour = 8; hour < 17; hour++) {
          if (sessionsToday >= maxSessions) break;
          const start = hour;
          const end = hour + 1;

          // Skip if already scheduled a session for this grade/subject/day/time (to avoid duplicates)
          const alreadyScheduled = schedule.some(s => s.grade === grade && s.subject === subject && s.day === day && s.start === start);
          if (alreadyScheduled) continue;

          const availableVolunteer = capableVolunteers
            .filter(v => volunteerHoursUsed[v.id] < v.target_hours)
            .sort((a, b) => (volunteerHoursUsed[a.id] / a.target_hours) - (volunteerHoursUsed[b.id] / b.target_hours))
            .find(v => isVolunteerAvailable(v, day, start, end));

          if (availableVolunteer) {
            schedule.push({
              id: Math.random().toString(36).substr(2, 9),
              volunteer_id: availableVolunteer.id,
              volunteer_name: availableVolunteer.name,
              volunteer_phone: availableVolunteer.phone,
              volunteer_color: availableVolunteer.color,
              subject,
              grade,
              day,
              start,
              end,
              status: 'scheduled'
            });
            volunteerHoursUsed[availableVolunteer.id]++;
            sessionsToday++;
          }
        }
      }
    }
  }

  return schedule;
}
