import * as React from "react";
import { Stack, TextField } from "office-ui-fabric-react";
import { FormProps } from "./Form.props";

export function Form(props: FormProps): JSX.Element {
  const { date, employee, manager } = props;

  return (
    <Stack tokens={{ childrenGap: "m" }}>
      <Stack
        wrap
        horizontal
        tokens={{ childrenGap: "m" }}
        styles={{
          root: {
            "& > *:first-child": {
              margin: 0,
            },
          },
        }}
      >
        <TextField
          defaultValue={employee.Title}
          label="Employee name"
          readOnly={true}
          borderless={true}
        />
        <TextField
          defaultValue={employee.Grupo}
          label="Position"
          readOnly={true}
          borderless={true}
        />
        <TextField
          defaultValue={employee.Departamento.Title}
          label="Area"
          readOnly={true}
          borderless={true}
        />
        <TextField
          defaultValue={date.toLocaleDateString()}
          label="Date"
          readOnly={true}
          borderless={true}
        />
        <TextField
          defaultValue={manager.Title}
          label="Manager"
          readOnly={true}
          borderless={true}
        />
      </Stack>
    </Stack>
  );
}
