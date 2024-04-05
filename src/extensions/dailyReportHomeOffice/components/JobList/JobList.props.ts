import { JobItemDto } from "../../../../types/JobItem";
import { ActionsColumnProps } from "../ActionsColumn/ActionsColumn.props";

export type JobItemAsString = {
  [K in keyof JobItemDto]: JobItemDto[K] extends Date ? string : JobItemDto[K];
};

export interface JobListProps extends Omit<ActionsColumnProps, "item"> {
  items: JobItemDto[];
}
