import {
    FETCH_SONGS,
    FETCH_SONG,
    CREATE_SONG,
    EDIT_SONG,
    DELETE_SONG,
    REMOVE_FROM_PLAYLIST,
    UPDATE_WITH_ID,
    UPDATE_WITH_WRONG_ID,
    UPDATE_WITH_TERM,
    CANCEL_SEARCH, 
    CLOSE_MODAL} from './types'
import { db } from '../api'
import history from '../history'
import { handleError } from '../util'

export const fetchSongs = () => async dispatch => {
    try {
        const response = await db.get('/songs/?format=json')
        dispatch({type: FETCH_SONGS, payload: response.data})
    } catch (err) {
        handleError(err, dispatch)
    }
}

export const fetchSong = id => async dispatch => {
    try {
        const response = await db.get(`/songs/${id}/?format=json`)
        dispatch({type: FETCH_SONG, payload: response.data})
    } catch (err) {
        handleError(err, dispatch)
    }

}

export const findId = (id) => async dispatch => {
    try {
        const response = await db.get(`/songs/${id}/?format=json`)
        dispatch({type: UPDATE_WITH_ID, payload: response.data})
    } catch (err) {
        if (err.response) {
            if (err.response.status === 404) {
                dispatch({type: UPDATE_WITH_WRONG_ID})
            } else {
                handleError(err, dispatch)
            }
        } else {
            handleError(err, dispatch)
        }
    }
}

export const searchSongs = (term, lyricsToo) => async dispatch => {
    try {
        const inTitle = await db.get(`/search-title/${term}/`)
        if (lyricsToo) {
            const inLyrics = await db.get(`/search-lyrics/${term}/`)
            dispatch({type: UPDATE_WITH_TERM, payload: [...inTitle.data, ...inLyrics.data]})
        } else {
            dispatch({type: UPDATE_WITH_TERM, payload: inTitle.data})
        }

    } catch (err) {
        handleError(err, dispatch)
    }
}

export const cancelSearch = () => {
    return { type: CANCEL_SEARCH}
}

export const createSong = formData => async (dispatch, getState) => {
    try {
        const response = await db.post('/songs/', {
            id: parseInt(formData.id),
            title: formData.title,
            lyrics: formData.lyrics.split('\n\n').join('###')
        }, { headers: {'Authorization': `Token ${getState().auth.token}` }})
        dispatch({type: CREATE_SONG, payload: response.data})
        history.push(`/dicsi/songs/${formData.id}`)
    } catch (err) {
        console.log(err.response)
        handleError(err, dispatch)
    }

}

export const editSong = (id, formData) => async (dispatch, getState) => {
    try {
        const response = await db.patch(`/songs/${id}/`, {
            title: formData.title,
            lyrics: formData.lyrics.split('\n\n').join('###'),
        }, { headers: {'Authorization': `Token ${getState().auth.token}` }})
        dispatch({type: EDIT_SONG, payload: response.data})
        history.push(`/dicsi/songs/${id}`)
    } catch (err) {
        handleError(err, dispatch)
    }
}

export const deleteSong = (id) => async (dispatch, getState) => {
    try {
        await db.delete(`/songs/${id}/`,
            { headers: {'Authorization': `Token ${getState().auth.token}` }})
        if (getState().playlist.list.includes(id)) {
            dispatch({ type: REMOVE_FROM_PLAYLIST, payload: id })
        }
        dispatch({type: DELETE_SONG, payload: id})
        dispatch({type: CLOSE_MODAL})
        history.push('/dicsi/')
    } catch(err) {
        handleError(err, dispatch)
    }
}