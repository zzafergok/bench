import { cva } from 'class-variance-authority';

export const attachmentVariants = cva(
  'group/attachment relative flex rounded-sm border transition-all text-titanium select-none',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row items-center',
        vertical: 'flex-col items-stretch',
      },
      size: {
        default: '',
        sm: '',
        xs: '',
      },
      state: {
        idle: 'border-gunmetal/40 bg-obsidian/60 hover:border-gunmetal/60',
        done: 'border-gunmetal/40 bg-obsidian/60 hover:border-gunmetal/60',
        uploading: 'border-tulpar-blue/40 bg-tulpar-blue/5',
        processing: 'border-tulpar-blue/40 bg-tulpar-blue/5',
        error: 'border-alert-red/50 bg-alert-red/5 text-alert-red',
      },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        size: 'default',
        className: 'gap-3 p-3 min-w-[14rem]',
      },
      {
        orientation: 'horizontal',
        size: 'sm',
        className: 'gap-2.5 p-2 min-w-[12rem]',
      },
      {
        orientation: 'horizontal',
        size: 'xs',
        className: 'gap-2 p-1.5 min-w-[10rem]',
      },
      {
        orientation: 'vertical',
        size: 'default',
        className: 'gap-2 p-3 w-48',
      },
      {
        orientation: 'vertical',
        size: 'sm',
        className: 'gap-2 p-2 w-40',
      },
      {
        orientation: 'vertical',
        size: 'xs',
        className: 'gap-1.5 p-1.5 w-32',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      size: 'default',
      state: 'done',
    },
  },
);
