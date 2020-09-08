import React, { useState } from "react";
import { Toast } from "react-bootstrap";


const ToastHandler = React.forwardRef((_props, ref) => {

  const [list, setList] = useState([]);

  const push = (toast) => {
    setList([toast, ...list]);
  };

  return <div ref={ref}>
    {list.map((toast, index) => <Toast>
      <Toast.Body>{toast.body}</Toast.Body>
    </Toast>)}
  </div>;
});
export default ToastHandler;