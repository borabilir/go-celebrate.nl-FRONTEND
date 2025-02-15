/* CORE types */

export interface LayoutParams {
  children: React.ReactNode;
  params: {
    [key: string]: string;
  };
}
export interface PageParams {
  children: React.ReactNode;
  params: {
    [key: string]: string;
    // Dynamic routes are array of strings
    slug: string[];
  };
  searchParams: {
    [key: string]: string;
  };
}

export type OnElementType = 'dark' | 'light';

/* Investor test */

import { ReactElement } from 'react';
import { UseFormReturnType } from '@mantine/form';

export type Option = {
  id: string;
  label: string;
  value: string;
};

export type Question = {
  id: string;
  label: string;
  orientation: 'horizontal' | 'vertical';
  options: Array<Option>;
};

export interface QuestionGroupProps {
  questions: Array<Question>;
  form: UseFormReturnType<unknown>;
  slide: object & { id: string }; // TODO: fix this
  slideIndex: number;
}

export interface SlideProps {
  id: string;
  title?: string;
  description?: ReactElement;
  questions?: Array<Question>;
  skippable?: boolean;
  actionLabel?: string;
  render?: string;
}

export interface LossCalculatorProps {
  form: UseFormReturnType<unknown>;
  slide: object & { id: string };
  slideIndex: number;
}

export interface LossCalculatorResultsProps {
  data: {
    regularIncome: string;
    additionalIncome: string;
    expenses: string;
    assets: string;
  };
  className: string;
}
