import { Volunteer } from './types';

export const VOLUNTEERS: Volunteer[] = [
  {
    id: '2',
    name: 'Souad Housseini',
    phone: '76553308',
    languages: ['English'],
    subjects: {
      '9': ['Maths', 'Chemistry', 'Biology'],
      '10': ['Maths', 'Chemistry', 'Biology'],
      '11': ['Maths', 'Chemistry', 'Biology'],
      '12': ['Maths', 'Chemistry', 'Biology']
    },
    availability: [
      { day: 'Monday', start: 12, end: 17 },
      { day: 'Tuesday', start: 12, end: 17 },
      { day: 'Wednesday', start: 12, end: 17 },
      { day: 'Thursday', start: 12, end: 17 },
      { day: 'Friday', start: 12, end: 17 },
      { day: 'Saturday', start: 12, end: 17 },
      { day: 'Sunday', start: 12, end: 17 }
    ],
    target_hours: 5,
    actual_hours: 0,
    can_problem_solve: false,
    can_review: true,
    role: 'Organizer',
    description: 'The heart and soul of ACM AUB. Souad manages everything with grace and precision, ensuring every volunteer and student feels supported.',
    color: '#9C27B0'
  },
  {
    id: '13',
    name: 'Hadi Kassem',
    phone: '+96103672478',
    languages: ['French', 'English'],
    subjects: {
      '9': ['Maths'],
      '10': ['Maths', 'Physics'],
      '11': ['Maths', 'Physics'],
      '12': ['Maths', 'Physics']
    },
    availability: [
      { day: 'Wednesday', start: 8, end: 12 },
      { day: 'Wednesday', start: 12, end: 17 },
      { day: 'Sunday', start: 8, end: 12 },
      { day: 'Sunday', start: 12, end: 17 }
    ],
    target_hours: 5,
    actual_hours: 0,
    can_problem_solve: true,
    can_review: true,
    role: 'Web Dev',
    description: 'The digital architect of ACM AUB. Hadi balances coding the future with teaching the fundamentals of science.',
    color: '#FFC107'
  },
  {
    id: '1',
    name: 'Reem Zaraket',
    phone: '+97466965228',
    languages: ['English'],
    subjects: {
      '9': ['English', 'Biology'],
      '10': ['English', 'Biology'],
      '11': ['English', 'Biology'],
      '12': ['English', 'Biology']
    },
    availability: [
      { day: 'Tuesday', start: 12, end: 17 },
      { day: 'Thursday', start: 12, end: 17 },
      { day: 'Saturday', start: 12, end: 17 },
      { day: 'Sunday', start: 12, end: 17 }
    ],
    target_hours: 4,
    actual_hours: 0,
    can_problem_solve: false,
    can_review: true,
    role: 'Member',
    description: 'A dedicated biologist with a passion for teaching English and life sciences. Reem brings a gentle and encouraging spirit to every session.',
    color: '#E91E63'
  },
  {
    id: '3',
    name: 'Ahmad Elamine',
    phone: '81 875328',
    languages: ['English'],
    subjects: {
      '9': ['Maths'],
      '10': ['Maths', 'Physics'],
      '11': ['Maths', 'Physics'],
      '12': ['Maths', 'Physics']
    },
    availability: [
      { day: 'Tuesday', start: 12, end: 17 },
      { day: 'Friday', start: 12, end: 17 },
      { day: 'Saturday', start: 12, end: 17 }
    ],
    target_hours: 2,
    actual_hours: 0,
    can_problem_solve: false,
    can_review: false,
    role: 'Member',
    description: 'A mathematical wizard who simplifies complex physics problems into bite-sized pieces. Ahmad is known for his flexible and patient approach.',
    color: '#673AB7'
  },
  {
    id: '4',
    name: 'Hussein Termos',
    phone: '+961 81 750 130',
    languages: ['English'],
    subjects: {
      '9': ['Maths'],
      '10': ['Maths'],
      '11': ['Maths'],
      '12': ['Maths']
    },
    availability: [
      { day: 'Thursday', start: 12, end: 17 },
      { day: 'Friday', start: 12, end: 17 },
      { day: 'Saturday', start: 12, end: 17 },
      { day: 'Sunday', start: 12, end: 17 }
    ],
    target_hours: 3,
    actual_hours: 0,
    can_problem_solve: true,
    can_review: false,
    role: 'Member',
    description: 'Hussein is a reliable and steady presence, always ready to dive into math problems and help students find their footing.',
    color: '#3F51B5'
  },
  {
    id: '5',
    name: 'Serena El-Hajj',
    phone: '70872650',
    languages: ['French', 'English'],
    subjects: {
      '9': ['Maths', 'Physics'],
      '10': ['Physics'],
      '11': ['Physics'],
      '12': ['Physics']
    },
    availability: [
      { day: 'Wednesday', start: 12, end: 17 },
      { day: 'Saturday', start: 12, end: 17 }
    ],
    target_hours: 3,
    actual_hours: 0,
    can_problem_solve: true,
    can_review: false,
    role: 'Member',
    description: 'Bilingual and brilliant, Serena bridges the gap between languages and complex physics concepts with ease.',
    color: '#2196F3'
  },
  {
    id: '6',
    name: 'Rayan Haidar',
    phone: '81896412',
    languages: ['English'],
    subjects: {
      '9': ['Maths', 'Chemistry', 'Physics'],
      '10': ['Maths', 'Chemistry', 'Physics'],
      '11': ['Maths', 'Chemistry', 'Physics'],
      '12': ['Maths', 'Chemistry', 'Physics']
    },
    availability: [
      { day: 'Monday', start: 12, end: 17 },
      { day: 'Tuesday', start: 12, end: 17 },
      { day: 'Wednesday', start: 12, end: 17 },
      { day: 'Thursday', start: 12, end: 17 }
    ],
    target_hours: 2,
    actual_hours: 0,
    can_problem_solve: true,
    can_review: false,
    role: 'Member',
    description: 'A multi-talented volunteer who excels in all things scientific. Rayan is always ready to tackle the toughest questions.',
    color: '#03A9F4'
  },
  {
    id: '7',
    name: 'Dalia Husseini',
    phone: '70136404',
    languages: ['English'],
    subjects: {
      '9': ['Chemistry', 'Biology'],
      '10': ['Biology'],
      '11': ['Biology'],
      '12': ['Biology']
    },
    availability: [
      { day: 'Monday', start: 12, end: 17 },
      { day: 'Tuesday', start: 12, end: 17 },
      { day: 'Wednesday', start: 12, end: 17 }
    ],
    target_hours: 3,
    actual_hours: 0,
    can_problem_solve: false,
    can_review: false,
    role: 'Member',
    description: 'Dalia brings the wonders of biology and chemistry to life. Her enthusiasm for science is truly contagious.',
    color: '#00BCD4'
  },
  {
    id: '8',
    name: 'Batoul Fardoun',
    phone: '70925980',
    languages: ['English'],
    subjects: {
      '9': ['Maths', 'Chemistry'],
      '10': ['Maths', 'Chemistry', 'Physics'],
      '11': ['Maths', 'Chemistry', 'Physics'],
      '12': ['Maths', 'Chemistry', 'Physics']
    },
    availability: [
      { day: 'Monday', start: 12, end: 17 },
      { day: 'Tuesday', start: 8, end: 12 },
      { day: 'Tuesday', start: 12, end: 17 },
      { day: 'Wednesday', start: 12, end: 17 },
      { day: 'Thursday', start: 8, end: 12 },
      { day: 'Friday', start: 12, end: 17 },
      { day: 'Saturday', start: 8, end: 12 },
      { day: 'Saturday', start: 12, end: 17 },
      { day: 'Sunday', start: 8, end: 12 },
      { day: 'Sunday', start: 12, end: 17 }
    ],
    target_hours: 3,
    actual_hours: 0,
    can_problem_solve: true,
    can_review: false,
    role: 'Member',
    description: 'With a schedule as diverse as her skills, Batoul is a versatile powerhouse in the ACM AUB volunteering team.',
    color: '#009688'
  },
  {
    id: '9',
    name: 'Mohammad Jaffal',
    phone: '71 906 035',
    languages: ['English'],
    subjects: {
      '9': ['Maths', 'Physics'],
      '10': ['Maths', 'Physics'],
      '11': ['Maths', 'Physics'],
      '12': ['Maths', 'Physics']
    },
    availability: [
      { day: 'Monday', start: 12, end: 17 },
      { day: 'Tuesday', start: 12, end: 17 },
      { day: 'Wednesday', start: 12, end: 17 },
      { day: 'Thursday', start: 12, end: 17 },
      { day: 'Friday', start: 12, end: 17 }
    ],
    target_hours: 5,
    actual_hours: 0,
    can_problem_solve: true,
    can_review: true,
    role: 'Member',
    description: 'A consistent and dedicated mentor, Mohammad is the go-to person for anyone struggling with math or physics.',
    color: '#4CAF50'
  },
  {
    id: '10',
    name: 'Hussein Abbas',
    phone: '+96178860882',
    languages: ['English'],
    subjects: {
      '9': ['Maths', 'Physics'],
      '10': ['Maths', 'Physics'],
      '11': ['Maths', 'Physics'],
      '12': ['Maths', 'Physics']
    },
    availability: [
      { day: 'Friday', start: 8, end: 12 },
      { day: 'Friday', start: 12, end: 17 },
      { day: 'Saturday', start: 8, end: 12 },
      { day: 'Saturday', start: 12, end: 17 },
      { day: 'Sunday', start: 8, end: 12 },
      { day: 'Sunday', start: 12, end: 17 }
    ],
    target_hours: 2,
    actual_hours: 0,
    can_problem_solve: true,
    can_review: true,
    role: 'Member',
    description: 'Hussein brings a weekend energy that keeps the momentum going. His clarity in teaching is highly valued.',
    color: '#8BC34A'
  },
  {
    id: '11',
    name: 'Mohamad Mehdi',
    phone: '70496599',
    languages: ['English'],
    subjects: {
      '9': ['English'],
      '10': ['English'],
      '11': ['English'],
      '12': ['English']
    },
    availability: [
      { day: 'Saturday', start: 12, end: 17 },
      { day: 'Sunday', start: 8, end: 12 }
    ],
    target_hours: 2,
    actual_hours: 0,
    can_problem_solve: false,
    can_review: true,
    role: 'Member',
    description: 'An English specialist who helps students find their voice and master the SATs with confidence.',
    color: '#CDDC39'
  },
  {
    id: '12',
    name: 'Ali Abdul Sater',
    phone: '78898612',
    languages: ['French', 'English'],
    subjects: {
      '9': ['Maths', 'Physics'],
      '10': ['Maths', 'Physics'],
      '11': ['Maths', 'Physics'],
      '12': ['Maths', 'Physics']
    },
    availability: [
      { day: 'Monday', start: 12, end: 17 },
      { day: 'Wednesday', start: 12, end: 17 },
      { day: 'Friday', start: 12, end: 17 },
      { day: 'Saturday', start: 12, end: 17 },
      { day: 'Sunday', start: 12, end: 17 }
    ],
    target_hours: 3,
    actual_hours: 0,
    can_problem_solve: true,
    can_review: true,
    role: 'Member',
    description: 'Ali is a multilingual science enthusiast who brings a global perspective to every tutoring session.',
    color: '#FFEB3B'
  },
  {
    id: '14',
    name: 'Layla',
    phone: '81196254',
    languages: ['English'],
    subjects: {
      '9': ['Arabic', 'English', 'Maths', 'Chemistry', 'Physics', 'Biology'],
      '10': ['Arabic', 'English', 'Maths', 'Chemistry', 'Physics', 'Biology'],
      '11': ['Arabic', 'English', 'Maths', 'Chemistry', 'Physics', 'Biology'],
      '12': ['Arabic', 'English', 'Maths', 'Chemistry', 'Physics', 'Biology']
    },
    availability: [
      { day: 'Monday', start: 12, end: 17 },
      { day: 'Tuesday', start: 12, end: 17 },
      { day: 'Wednesday', start: 12, end: 17 },
      { day: 'Thursday', start: 12, end: 17 },
      { day: 'Friday', start: 12, end: 17 }
    ],
    target_hours: 3,
    actual_hours: 0,
    can_problem_solve: true,
    can_review: true,
    role: 'Member',
    description: 'A true polymath. Layla can teach almost anything, making her an invaluable asset to the entire team.',
    color: '#FF9800'
  },
  {
    id: '15',
    name: 'Karim El Zahran',
    phone: '70 949 214',
    languages: ['English'],
    subjects: {
      '9': ['Maths', 'Chemistry', 'Physics'],
      '10': ['Maths', 'Chemistry', 'Physics'],
      '11': ['Maths', 'Chemistry', 'Physics'],
      '12': ['Maths', 'Chemistry', 'Physics']
    },
    availability: [
      { day: 'Tuesday', start: 12, end: 17 },
      { day: 'Thursday', start: 12, end: 17 },
      { day: 'Friday', start: 12, end: 17 },
      { day: 'Saturday', start: 12, end: 17 },
      { day: 'Sunday', start: 12, end: 17 }
    ],
    target_hours: 2,
    actual_hours: 0,
    can_problem_solve: false,
    can_review: false,
    role: 'Member',
    description: 'Karim is a sharp and focused tutor who excels in breaking down complex scientific theories into understandable concepts.',
    color: '#FF5722'
  }
];
