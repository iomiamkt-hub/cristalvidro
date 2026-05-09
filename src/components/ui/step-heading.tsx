interface StepHeadingProps {
  children: React.ReactNode;
}

/** Título principal de cada step — assertivo, respirando */
export function StepHeading({ children }: StepHeadingProps) {
  return (
    <h1 className="text-[2.15rem] font-medium text-white leading-[1.1] tracking-tight mb-11">
      {children}
    </h1>
  );
}
