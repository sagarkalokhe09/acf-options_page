import React from "react";
import "./table.scss";
import { useTable } from "react-table";
import { Table } from "react-bootstrap";

import { ReactComponent as XCircle } from "bootstrap-icons/icons/x-circle.svg";
import { ReactComponent as CodeSlash } from "bootstrap-icons/icons/code-slash.svg";

const ActionTable = ({ actions, updateMyData }) => {

  const data = React.useMemo(() => actions, [actions]);

  // Create an editable cell renderer
  const EditableCell = ({ value: initialValue, row: { index }, column: { id }, updateMyData }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return <input value={value} className="form-control" onChange={onChange} onBlur={onBlur} />;
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };


  const columns = React.useMemo(() => [
    {
      Header: 'Init Wait',
      style: { width: "90px" },
      accessor: 'initWait', // accessor is the "key" in the data
    }, {
      Header: 'Name',
      style: { width: "90px" },
      accessor: 'name',
    }, {
      Header: 'Element',
      accessor: 'element',
    }, {
      Header: 'Value',
      accessor: 'value',
    }, {
      Header: 'Repeat',
      style: { width: "90px" },
      accessor: 'repeat',
    }, {
      Header: 'R-Interval',
      style: { width: "100px" },
      accessor: 'repeatInterval',
    }
  ], []);

  const tableInstance = useTable({ columns, data, defaultColumn, updateMyData });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return <Table hover {...getTableProps()} id="actions">
    <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps([{ style: column.style }])}>
              {column.render('Header')}
            </th>
          ))}
          <th style={{ width: "80px" }}></th>
        </tr>
      ))}
    </thead>
    <tbody {...getTableBodyProps()}>
      {rows.map(row => {
        prepareRow(row);
        return (<tr {...row.getRowProps()}>
          {row.cells.map(cell => (
            <td {...cell.getCellProps()}>
              {cell.render('Cell')}
            </td>
          ))}
          <td align="center">
            <CodeSlash className="text-primary mr-3" width="20" height="20" onClick={() => { console.log(row.id); }} />
            <XCircle className="text-danger" width="20" height="20" onClick={() => { console.log(row.id); }} />
          </td>
        </tr>
        );
      })}
    </tbody>
  </Table>;
};

export default ActionTable;