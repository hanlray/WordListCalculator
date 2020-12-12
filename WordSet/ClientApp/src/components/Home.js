import React from 'react';
//import { Upload, Button, Form, Card, Checkbox, Divider } from 'antd';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { UploadOutlined } from '@ant-design/icons';
import { ErrorMessage, Field } from 'formik';
import axios from 'axios';
import { DropzoneArea } from 'material-ui-dropzone';
import * as Yup from 'yup';
import { Wizard } from './Wizard';
import { WordsViewer } from './WordsViewer';
import { Uploader } from './Uploader';

export class Home extends React.Component {
    static #lists = ['NGSL', 'NAWL'];

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            srcFiles: [],

            srcList: {
                checkAll: false,
                indeterminate: true,
                checkedList: [],
            },

            diffFiles: [],
            diffList: {
                checkAll: false,
                indeterminate: true,
                checkedList: ['NGSL', 'NAWL'],
            },

            calculationId: null
        };
    }

    handleSubmit = async (values) => {
        //setLoading(true);

        const { srcFiles, srcList, diffFiles } = this.state;
        const formData = new FormData();
        srcFiles.forEach(file => {
            formData.append('srcFiles', file);
        });

        Array.from(diffFiles).forEach(file => {
            formData.append('diffFiles', file);
        });

        srcList.checkedList.forEach(list => {
            formData.append('srcLists', list);
        });

        const res = await axios.post('/wordset',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        this.setState({
            calculationId: res.data.id
        });
    }

    uploadProps(filesState) {
        return {
            onRemove: file => {
                this.setState(state => {
                    const index = state[filesState].indexOf(file);
                    const newFileList = state[filesState].slice();
                    newFileList.splice(index, 1);
                    return {
                        [filesState]: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    [filesState]: [...state[[filesState]], file],
                }));
                return false;
            },
            fileList: this.state[filesState]
        }
    }

    checkboxGroupProps(stateProp) {
        return {
            value: this.state[stateProp].checkedList,
            onChange: list => {
                this.setState({
                    [stateProp]: {
                        checkedList: list,
                        indeterminate: !!list.length && list.length < Home.#lists.length,
                        checkAll: list.length === Home.#lists.length
                    }
                });
            }
        }
    }

    checkAllProps(stateProp) {
        return {
            indeterminate: this.state[stateProp].indeterminate,
            checked: this.state[stateProp].checkAll,
            onChange: e => {
                this.setState({
                    [stateProp]: {
                        checkedList: e.target.checked ? Home.#lists : [],
                        indeterminate: false,
                        checkAll: e.target.checked
                    }
                });
            }
        }
    }

    handleChange = (event) => {
        const { srcList } = this.state;
        const listName = event.target.name;
        if (event.target.checked) {
            if (srcList.checkedList.indexOf(listName) < 0)
                srcList.checkedList.push(listName)
        } else {
            const index = srcList.checkedList.indexOf(listName);
            if (index >= 0)
                srcList.checkedList.splice(index, 1);
        }

        this.setState({
            srcList: srcList
        });
    };

    handleCapture = ({ target }) => {
        const name = target.name;

        this.setState({
            [name]: target.files
        });
    };

    onFilesChange = (stateName, files) => {
        this.setState({
            [stateName]: files
        });
        //console.log("Files:", files);
        //this[stateName] = files;
    };

    render() {
        const { loading, srcList, calculationId, diffFiles } = this.state;
        const WizardStep = ({ children }) => children;

        const srcFormList = Home.#lists.map((list) => {
            const checked = srcList.checkedList.indexOf(list) >= 0;
            return <FormControlLabel
                control={<Checkbox checked={checked} onChange={this.handleChange} name={list} />}
                label={list}
            />
        });

        return (
            <>
                <Wizard
                    initialValues={{
                        email: '',
                        firstName: '',
                        lastName: '',
                    }}
                    onSubmit={this.handleSubmit}
                >
                    <WizardStep>
                        <div>
                            <input
                                accept="image/*"
                                id="contained-button-file"
                                multiple
                                type="file"
                                name="srcFiles"
                                onChange={this.handleCapture}
                            />
                        </div>
                        <div>
                            <FormGroup>{srcFormList}</FormGroup>
                        </div>
                    </WizardStep>
                    <WizardStep>
                        <Uploader onDropAccepted={(files) => this.onFilesChange("diffFiles", files)} initialFiles={diffFiles} />
                    </WizardStep>
                </Wizard>
                <WordsViewer calculationId={calculationId} />
            </>
        );
    }
}
