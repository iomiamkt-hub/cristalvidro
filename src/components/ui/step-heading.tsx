interface StepHeadingProps {
  children: React.ReactNode;
}

export function StepHeading({ children }: StepHeadingProps) {
  return (
    <h1 className="text-[1.75rem] font-semibold text-white tracking-tight leading-[1.15] mb-8">
      {children}
    </h1>
  );
}
