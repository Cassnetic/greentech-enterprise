'use client';

import { useMemo } from 'react';
import { BookingForm } from './BookingForm';
import { Service } from '@/lib/constants';

interface Props {
  initialService: Service | null;
  blockedDates: string[];
}

export function BookingFormWrapper({ initialService, blockedDates }: Props) {
  const set = useMemo(() => new Set(blockedDates), [blockedDates]);
  return <BookingForm initialService={initialService} blockedDates={set} />;
}
