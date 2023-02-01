import React, {useCallback} from "react";
import { useDropzone } from "react-dropzone";

function Dropzone({open, getFileList}) {
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        getFileList(acceptedFiles[0]);
    });
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({});

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here</p>
        <button type="button" onClick={open} className="btn">
            Click to select files
        </button>
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
    </div>
  );
}

export default Dropzone;