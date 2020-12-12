import React from 'react';
import Dropzone from 'react-dropzone'

export function Uploader(props) {
    const files = props.initialFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));
    return (
        <Dropzone {...props}>
            {({ getRootProps, getInputProps, acceptedFiles }) => {
                return (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                        <aside>
                            <h4>Files</h4>
                            <ul>{files}</ul>
                        </aside>
                    </section>
                );
            }}
        </Dropzone>
    );
}