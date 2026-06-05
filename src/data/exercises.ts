import { Mountain, Footprints, Bike, Waves, Dumbbell, PersonStanding, Flame, Heart } from 'lucide-react';

export interface Exercise {
  id: string;
  name: string;
  metValue: number;
  icon: typeof Mountain;
  unit: string;
}

export const exercises: Exercise[] = [
  {
    id: 'stairs',
    name: '爬楼梯',
    metValue: 9.0,
    icon: Mountain,
    unit: '分钟'
  },
  {
    id: 'walking',
    name: '快走',
    metValue: 4.3,
    icon: Footprints,
    unit: '分钟'
  },
  {
    id: 'running',
    name: '跑步',
    metValue: 9.8,
    icon: Footprints,
    unit: '分钟'
  },
  {
    id: 'cycling',
    name: '骑自行车',
    metValue: 6.8,
    icon: Bike,
    unit: '分钟'
  },
  {
    id: 'swimming',
    name: '游泳',
    metValue: 7.0,
    icon: Waves,
    unit: '分钟'
  },
  {
    id: 'weight-training',
    name: '力量训练',
    metValue: 5.0,
    icon: Dumbbell,
    unit: '分钟'
  },
  {
    id: 'yoga',
    name: '瑜伽',
    metValue: 2.5,
    icon: PersonStanding,
    unit: '分钟'
  },
  {
    id: 'jumping-rope',
    name: '跳绳',
    metValue: 12.3,
    icon: Heart,
    unit: '分钟'
  },
  {
    id: 'dancing',
    name: '跳舞',
    metValue: 4.8,
    icon: Flame,
    unit: '分钟'
  },
  {
    id: 'sitting',
    name: '坐着',
    metValue: 1.3,
    icon: PersonStanding,
    unit: '分钟'
  }
];

export function getExercisesForDisplay(count: number = 6): Exercise[] {
  const displayIds = ['stairs', 'walking', 'running', 'cycling', 'swimming', 'jumping-rope'];
  return displayIds.map(id => exercises.find(e => e.id === id)!).filter(Boolean).slice(0, count);
}
