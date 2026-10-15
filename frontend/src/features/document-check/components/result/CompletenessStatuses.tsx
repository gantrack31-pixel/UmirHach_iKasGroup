import { checkStatuses, statusContent } from "../../data/statusLabels";
import type { CheckStatus } from "../../types/documentCheck";
import { Icon } from "../../../../shared/components/Icon";

export function CompletenessStatuses({ status }: { status: CheckStatus }) {
  return (
    <div className="status-options" role="list" aria-label="Комплектность документа">
      {checkStatuses.map((item) => (
        <div className={`status-option ${item}${status === item ? " is-active" : ""}`} key={item} role="listitem" aria-current={status === item ? "true" : undefined}>
          <span className="status-icon">{item === "success" ? <Icon name="check" size={22} /> : statusContent[item].icon}</span>
          <span>{statusContent[item].label}</span>
        </div>
      ))}
    </div>
  );
}
