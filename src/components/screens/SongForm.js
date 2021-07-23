import React from 'react'
import { Field, reduxForm } from 'redux-form'
import ReactTooltip from 'react-tooltip'

const renderInput = ({ input, label, meta, type, disabled, wide, tip }) => {
    return (
        <div className={`${wide} field ${meta.error && meta.touched ? 'error' : ''}`}>
            <label>{label}</label>
            <input {...input} type={type} autoComplete="off" disabled={disabled} data-tip={tip} />
            {renderError(meta)}
        </div>
    )
}

const renderTextArea = ({ input, label, meta, tip }) => {
    return (
        <div className={`field ${meta.error && meta.touched ? 'error' : ''}`}>
            <label>{label}</label>
            <textarea {...input} autoComplete="off" data-tip={tip}/>
            {renderError(meta)}
        </div>
    )
}

const renderError = ({ error, touched }) => {
    if (touched && error) {
        return (
            <div className="ui error message">
                <div className="header">
                    {error}
                </div>
            </div>
        )
    }
}

const SongForm = props => {

    const onSubmit = formValues => {
        props.onSubmit(formValues)
    }

    return (
        <form className="ui form error" onSubmit={props.handleSubmit(onSubmit)}>
            <ReactTooltip effect="solid" place="left"/>
            <div className="fields">
                <Field wide="three wide" tip="A dal sorszáma. Egyedi, később nem változtatható" name="id" component={renderInput} label="Sorszám" type="number" props={{ disabled: props.edit}}/>
                <Field wide="thirteen wide" name="title" component={renderInput} label="Cím" type="text"/>
            </div>
            <Field tip="Az alkalmazás dupla sorközöknél bontja versszakokra a szöveget." name="lyrics" component={renderTextArea} label="Dalszöveg"/>
            <Field name="pwd" component={renderInput} label="Jelszó" type="password"/>
            <button className="ui button primary">Mentés</button>
        </form>
    )
}

const validate = formValues => {
    const errors = {}

    if (!formValues.id) {
        errors.id = 'Add meg a dal sorszámát!'
    }

    if (!formValues.title) {
        errors.title = 'Add meg a dal címét!'
    }
    if (!formValues.lyrics) {
        errors.lyrics = 'Add meg a dalszöveget!'
    }
    if (!formValues.pwd) {
        errors.pwd = 'Add meg a jelszót!'
    }
    return errors
}

export default reduxForm({
    form: 'songForm',
    validate
})(SongForm)