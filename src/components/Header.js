import React from 'react'
import { Link } from 'react-router-dom'
import Alert from '@material-ui/lab/Alert'
import { connect } from 'react-redux'
import { isMobileOnly } from 'react-device-detect'

import '../styles.css'
import { removeAlert } from '../actions/alertActions'


const Header = (props) => {
    const alert = props.alert.msg ?
        <Alert onClose={() => {props.removeAlert()}} severity={props.alert.type} >
            {props.alert.msg}
        </Alert>
        : null
    const title = isMobileOnly ? <div className="big-text-nom">ÖKGY Énekeskönyv</div> : <h2>ÖKGY Énekeskönyv</h2>
    return (
        <div className="ui secondary pointing menu my-header">
            <Link to="/dicsi" className="item ">{title}</Link>
            <Link to="/dicsi" className="item header-link">Énekek listája</Link>
            <Link to="/dicsi/songs/new" className="item header-link">Új ének</Link>
            <div className="centered">
                {alert}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        alert: state.alert
    }
}

export default connect(mapStateToProps, { removeAlert })(Header)