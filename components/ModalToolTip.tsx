import { TooltipProps, Tooltip, ComponentWithAs } from '@chakra-ui/react';
import React, { forwardRef } from 'react';

type ModalToolTipProps = {
  text: string;
} & TooltipProps;

const ModalToolTip = forwardRef<HTMLDivElement, ModalToolTipProps>(
  (props, ref) => {
    return (
      <Tooltip
        {...props}
        ref={ref}
        shouldWrapChildren
        label={props.text}
        aria-label={props.text}
        zIndex={1401}
      >
        {props.children}
      </Tooltip>
    );
  }
);

export default ModalToolTip;
