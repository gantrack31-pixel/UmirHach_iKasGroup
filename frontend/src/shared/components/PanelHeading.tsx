type PanelHeadingProps = {
  step: string;
  title: string;
};

export function PanelHeading({ step, title }: PanelHeadingProps) {
  return <div className="panel-heading"><span className="step-number">{step}</span><h2>{title}</h2></div>;
}
