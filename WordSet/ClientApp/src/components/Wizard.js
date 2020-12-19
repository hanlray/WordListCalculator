import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    buttons: {
        display: 'flex',
        marginTop: theme.spacing(2),
    },
    back: {
        marginRight: theme.spacing(2),
    },
}));

// Wizard is a single Formik instance whose children are each page of the
// multi-step form. The form is submitted on each forward transition (can only
// progress with valid input), whereas a backwards step is allowed with
// incomplete data. A snapshot of form state is used as initialValues after each
// transition. Each page has an optional submit handler, and the top-level
// submit is called when the final page is submitted.
const Wizard = ({ children, initialValues, onSubmit }) => {
    const classes = useStyles();

    const [stepNumber, setStepNumber] = useState(0);
    const steps = React.Children.toArray(children);
    const [snapshot, setSnapshot] = useState(initialValues);

    const step = steps[stepNumber];
    const totalSteps = steps.length;
    const isLastStep = stepNumber === totalSteps - 1;

    const next = values => {
        setSnapshot(values);
        setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
    };

    const previous = values => {
        setSnapshot(values);
        setStepNumber(Math.max(stepNumber - 1, 0));
    };

    const handleSubmit = async (values, bag) => {
        if (step.props.onSubmit) {
            await step.props.onSubmit(values, bag);
        }
        if (isLastStep) {
            return onSubmit(values, bag);
        } else {
            bag.setTouched({});
            next(values);
        }
    };

    return (
        <Formik
            initialValues={snapshot}
            onSubmit={handleSubmit}
            validationSchema={step.props.validationSchema}
        >
            {formik => (
                <Form>
                    {step}
                    <div className={ classes.buttons }>
                        {stepNumber > 0 && (
                            <Button className={classes.back} variant="contained" color="primary" onClick={() => previous(formik.values)} type="button">Back</Button>
                        )}
                        <div>
                            <Button variant="contained" color="primary" disabled={formik.isSubmitting} type="submit">{isLastStep ? 'Submit' : 'Next'}</Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export { Wizard };

