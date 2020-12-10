import React, { Component } from 'react';
import { Tag } from 'antd';
import { Grid, Row, Col } from 'react-flexbox-grid';
import axios from 'axios';

const wordStyles = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    padding: 10,
};

export class WordsViewer extends Component {
    constructor(props) {
        super(props);
        this.state = { words: [] };
    }

    componentDidUpdate(prevProps) {
        if (this.props.calculationId !== prevProps.calculationId) {
            axios.get('/wordset/' + this.props.calculationId).then(res => {
                this.setState({ words: res.data });
            });
        }
    }

    render() {
        if (!this.props.calculationId) return (null);
        const { words } = this.state;
        const listItems = words.map((word) =>
            <Col xs><Tag>{word}</Tag></Col>
        );
        const link = "/Results/" + this.props.calculationId + ".txt";
        return (
            <div>
                <p>Word Count: {words.length} <a href={link}>Download</a></p>
                <Grid fluid>
                    <Row>{listItems}</Row>
                </Grid>
            </div>
        );
    }
}
