import { TooltipProps, Tooltip } from '@chakra-ui/core';
import React from 'react';

type ModalToolTipProps = {
  text: string;
} & TooltipProps;

export default function ModalToolTip({ text, ...props }: ModalToolTipProps) {
  return (
    <Tooltip
      {...props}
      shouldWrapChildren
      label={text}
      aria-label={text}
      zIndex={1401}
    >
      {props.children}
    </Tooltip>
  );
}
