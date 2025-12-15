import { IOACategory } from '../types/category';

export const IOA_CATEGORIES: Record<number, IOACategory> = {
  1: {
    id: 1,
    name: 'Compensation & Benefits',
    shortName: 'Compensation',
    description: 'Disputes regarding staff member salaries, allowances, pension benefits, medical insurance, severance packages, and other forms of employee compensation and benefits.',
    color: '#3B82F6',
    icon: 'DollarSign',
    subcategories: ['1.a', '1.b', '1.c', '1.d', '1.e', '3.c']
  },
  2: {
    id: 2,
    name: 'Evaluative Relationships',
    shortName: 'Evaluative',
    description: 'Issues arising from supervisor-employee relationships including performance evaluations, management decisions, work assignments, retaliation claims, and employment terms and conditions.',
    color: '#10B981',
    icon: 'ClipboardCheck',
    subcategories: ['2.a', '2.b', '2.c', '2.d', '2.e', '2.f', '2.g', '2.h', '2.i', '2.j', '2.k', '2.l', '2.m', '2.n', '2.o', '2.p', '2.q', '2.r', '2.s']
  },
  3: {
    id: 3,
    name: 'Peer and Colleague Relationships',
    shortName: 'Peer Relations',
    description: 'Conflicts and concerns between colleagues at the same organizational level, including workplace harassment, discrimination, and interpersonal disputes among peers.',
    color: '#8B5CF6',
    icon: 'Users',
    subcategories: ['3.a', '3.b', '3.d', '3.e', '3.f', '3.g', '3.h', '3.i', '3.j']
  },
  4: {
    id: 4,
    name: 'Career Progression and Development',
    shortName: 'Career',
    description: 'Disputes concerning recruitment, hiring, promotions, lateral moves, job reclassification, professional development opportunities, contract renewals, and separation from service.',
    color: '#F59E0B',
    icon: 'TrendingUp',
    subcategories: ['4.a', '4.b', '4.c', '4.d', '4.e', '4.f', '4.g', '4.h', '4.i', '4.j', '4.k', '4.l']
  },
  5: {
    id: 5,
    name: 'Legal, Regulatory, Financial and Compliance',
    shortName: 'Legal',
    description: 'Legal compliance issues, regulatory violations, financial misconduct, fraud, abuse of authority, and other matters that may create legal or financial risk for the organization.',
    color: '#EF4444',
    icon: 'Scale',
    subcategories: ['5.a', '5.b', '5.c', '5.d', '5.e', '5.f', '5.g', '5.h', '5.i', '5.j']
  },
  6: {
    id: 6,
    name: 'Safety, Health, and Physical Environment',
    shortName: 'Safety',
    description: 'Workplace safety concerns, occupational health issues, medical conditions affecting work, disability accommodations, and physical work environment conditions.',
    color: '#06B6D4',
    icon: 'Shield',
    subcategories: ['6.a', '6.b', '6.c', '6.d', '6.e', '6.f', '6.g', '6.h', '6.i', '6.j']
  },
  7: {
    id: 7,
    name: 'Services/Administrative Issues',
    shortName: 'Services',
    description: 'Problems with HR services, administrative processes, information technology systems, procurement, facilities management, and other organizational support services.',
    color: '#6366F1',
    icon: 'FileText',
    subcategories: ['7.a', '7.b', '7.c', '7.d', '7.e']
  },
  8: {
    id: 8,
    name: 'Organizational, Strategic, and Mission Related',
    shortName: 'Organizational',
    description: 'Concerns about organizational policies, restructuring, budget decisions, resource allocation, strategic direction, departmental management, and institutional mission.',
    color: '#EC4899',
    icon: 'Target',
    subcategories: ['8.a', '8.b', '8.c', '8.d', '8.e', '8.f', '8.g', '8.h', '8.i', '8.j', '8.k']
  },
  9: {
    id: 9,
    name: 'Values, Ethics, and Standards',
    shortName: 'Ethics',
    description: 'Violations of code of conduct, ethical breaches, conflicts of interest, professional standards violations, disciplinary actions, and concerns about fairness in applying organizational policies.',
    color: '#14B8A6',
    icon: 'Heart',
    subcategories: ['9.a', '9.b', '9.c', '9.d', '9.e']
  }
};

export const getAllCategories = (): IOACategory[] => {
  return Object.values(IOA_CATEGORIES);
};

export const getCategoryById = (id: number): IOACategory | undefined => {
  return IOA_CATEGORIES[id];
};

export const getCategoryBySubcategory = (subcategory: string): IOACategory | undefined => {
  return Object.values(IOA_CATEGORIES).find(category =>
    category.subcategories.some(sub => subcategory.startsWith(sub))
  );
};
