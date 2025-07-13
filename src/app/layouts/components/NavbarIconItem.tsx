import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { PropsWithChildren, ReactNode } from 'react';

export type NavbarIconItemProps = {
  tooltip?: ReactNode;
};

export function NavbarIconItem(props: PropsWithChildren<NavbarIconItemProps>) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="h-11 w-11 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
          {props.children}
        </div>
      </TooltipTrigger>
      <TooltipContent>{props.tooltip}</TooltipContent>
    </Tooltip>
  );
}
