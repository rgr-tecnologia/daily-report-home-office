import * as React from "react";
import {
  DetailsList,
  IColumn,
  IStyle,
  Text,
  TooltipHost,
  TooltipOverflowMode,
} from "office-ui-fabric-react";
import { JobItemAsString, JobListProps } from "./JobList.props";
import { SelectionMode } from "@fluentui/react";
import { ActionsColumn } from "../ActionsColumn/ActionsColumn";
import { JobItemDto } from "../../../../types/JobItem";

export function JobList(props: JobListProps): JSX.Element {
  const {
    items,
    isManager,
    isEmployee,
    status,
    onApprove,
    onReject,
    onEdit,
    onDelete,
  } = props;

  const [jobItems, setJobItems] = React.useState<JobItemDto[]>(items);
  const formatarData = (data: any) => {
    data = new Date(data);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
  
    return `${dia}/${mes}/${ano}`;
  }
  React.useEffect(() => {
    setJobItems(items);
  }, [items]);

  const formatJobItemsDateProperties = (
    items: JobItemDto[]
  ): JobItemAsString[] =>
    items.map((item) => {
      return {
        ...item,
        HoraInicio: item.HoraExtra ? item.HoraInicio.toLocaleTimeString() : "",
        HoraFim: item.HoraExtra ? item.HoraFim.toLocaleTimeString() : "",
        DataRetroativaTexto: item.DataRetroativa ? item?.DataRetroativaTexto : "",
        JustificativaRetroativa: item?.JustificativaRetroativa,
        DataRetroativa: item.DataRetroativa
      };
    });

  const columns: IColumn[] = [
    {
      key: `column10`,
      name: "Actions",
      minWidth: 75,
      onRender: (item: JobItemAsString) => (
        <ActionsColumn
          isManager={isManager}
          isEmployee={isEmployee}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={onEdit}
          onDelete={onDelete}
          item={items.filter((i) => i.Id === item.Id)[0]}
          status={status}
        />
      ),
    },
    {
      key: `column2`,
      name: "Title",
      minWidth: 75,
      onRender: (item) => {
        return (
          <TooltipHost
            content={item.Title}
            overflowMode={TooltipOverflowMode.Parent}
          >
            <Text>{item.Title}</Text>
          </TooltipHost>
        );
      },
    },
    {
      key: `column3`,
      name: "Description",
      minWidth: 75,
      onRender: (item) => {
        return (
          <TooltipHost
            content={item.Description}
            overflowMode={TooltipOverflowMode.Parent}
          >
            <Text>{item.Description}</Text>
          </TooltipHost>
        );
      },
    },
    {
      key: `column4`,
      name: "Status",
      minWidth: 75,
      onRender: (item: JobItemAsString) => {
        let style: IStyle = {
          borderRadius: "1rem",
          padding: "0.25rem 0.5rem",
          margin: "0.5rem",
          height: "1.5rem",
        };

        if (item.Status === "Approved") {
          style = {
            ...style,
            color: "#437406",
            backgroundColor: "#CFFFB8",
          };
        } else if (item.Status === "Rejected") {
          style = {
            ...style,
            color: "#8F6200",
            backgroundColor: "#FFEBC0",
          };
        } else if (item.Status === "In review") {
          style = {
            ...style,
            color: "#0068B8",
            backgroundColor: "#D4E7F6",
          };
        }

        return (
          <>
            <Text
              variant="small"
              styles={{
                root: style,
              }}
            >
              {item.Status}
            </Text>
          </>
        );
      },
    },
    {
      key: `column5`,
      name: "Overtime hours",
      minWidth: 75,
      onRender: (item) => {
        const totalMinutes = Math.round(item.QuantidadeHoras * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return <>{`${hours}h ${minutes}m`}</>;
      },
    },
    {
      key: `column6`,
      name: "Start time",
      fieldName: "HoraInicio",
      minWidth: 75,
    },
    {
      key: `column7`,
      name: "End time",
      fieldName: "HoraFim",
      minWidth: 75,
    },
    {
      key: `column9`,
      name: "Home office?",
      fieldName: "",
      minWidth: 75,
      onRender: ({ HomeOffice }) => <>{HomeOffice ? "Yes" : "No"}</>,
    },
    {
      key: `column9`,
      name: "Overtime?",
      minWidth: 75,
      onRender: ({ HoraExtra }) => <>{HoraExtra ? "Yes" : "No"}</>,
    },
    {
      key: `column10`,
      name: "Manager's note",
      minWidth: 75,
      onRender: (item) => {
        return (
          <TooltipHost
            content={item.ObservacaoGestor}
            overflowMode={TooltipOverflowMode.Parent}
          >
            <Text>{item.ObservacaoGestor}</Text>
          </TooltipHost>
        );
      },
    },
    {
      key: `column11`,
      name: "Data Retroativa",
      minWidth: 75,
      onRender: (item) => <>{item.DataRetroativa? "Yes" : "No"}</>,
    },
    {
      key: `column12`,
      name: "Justificativa Retroativa",
      minWidth: 75,
      onRender: (item) => {
        return (
          <TooltipHost
            content={item.JustificativaRetroativa}
            overflowMode={TooltipOverflowMode.Parent}
          >
            <Text >{item.JustificativaRetroativa ? item.JustificativaRetroativa.replace(/<(.|\n)*?>/g, ''): ''}</Text>
          </TooltipHost>
        );
      },
    },
    {
      key: `column13`,
      name: "Data Retroativa Text",
      fieldName: "Data Retroativa",
      minWidth: 75,
      onRender: (item) => {
        return (
          <TooltipHost
            content={item.DataRetroativaTexto}
            overflowMode={TooltipOverflowMode.Parent}
          >
            <Text>{item.DataRetroativaTexto ? formatarData(item.DataRetroativaTexto): ''}</Text>
          </TooltipHost>
        );
      },
    },

   
  ];


  return (
    <>
      <DetailsList
        items={formatJobItemsDateProperties(jobItems)}
        columns={columns}
        selectionMode={SelectionMode.none}
      />
    </>
  );
}
