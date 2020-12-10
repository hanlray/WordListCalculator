import React from 'react';
import { Upload, Button, Form, Card, Checkbox, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { WordsViewer } from './WordsViewer';

const CheckboxGroup = Checkbox.Group;

const formStyles = {
    background: "#ececec"
};

export class Home extends React.Component {
    static #lists = ['NGSL', 'NAWL'];

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            sourceFiles: [],

            srcList: {
                checkAll: false,
                indeterminate: true,
                checkedList: ['NGSL', 'NAWL'],
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

        const { sourceFiles, srcList, diffFiles } = this.state;
        const formData = new FormData();
        sourceFiles.forEach(file => {
            formData.append('srcFiles', file);
        });

        diffFiles.forEach(file => {
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

    render() {
        const { loading, calculationId } = this.state;

        return (
            <>
                <Form onFinish={this.handleSubmit} styles={formStyles}>
                    <Card title="Source Words">
                        <Upload name="sourceFiles" directory {...this.uploadProps('sourceFiles')}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                        <div>
                            <Checkbox {...this.checkAllProps('srcList')}>
                                Check all
                        </Checkbox>
                            <Divider />
                            <CheckboxGroup options={Home.#lists} {...this.checkboxGroupProps('srcList')} />
                        </div>
                    </Card>
                    <Card title="Difference with">
                        <Upload {...this.uploadProps('diffFiles')}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                        <div>
                            <Checkbox {...this.checkAllProps('diffList')}>
                                Check all
                        </Checkbox>
                            <Divider />
                            <CheckboxGroup options={Home.#lists} {...this.checkboxGroupProps('diffList')} />
                        </div>
                    </Card>
                    <Card title="Intersection with">
                    </Card>
                    <Form.Item>
                        <Button type="primary" loading={loading} htmlType="submit">
                            Submit
                    </Button>
                    </Form.Item>
                </Form>
                <WordsViewer calculationId={calculationId} />
            </>
        );
    }
}
