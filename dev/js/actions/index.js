import {
	NEW_WORD,
	SET_LAST_WORD,
	UPDATE_PREDICTIONS
} from './names'

export const addWord = word => ({ type: NEW_WORD, word })
export const setLastWord = (allWords, word) => ({ type: SET_LAST_WORD, allWords, word })
export const updatePredictions = (word, prediction) => ({ type: UPDATE_PREDICTIONS, word, prediction })