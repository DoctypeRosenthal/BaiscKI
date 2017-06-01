import {
	SET_INPUT_VAL,
	NEW_WORD,
	SET_LAST_WORD,
	UPDATE_PREDICTIONS,
	ANALYZE_WHOLE_TEXT
} from './names'

export const setInputVal = str => ({ type: SET_INPUT_VAL, str })
export const addWord = word => ({ type: NEW_WORD, word })
export const setLastWord = (allWords, word) => ({ type: SET_LAST_WORD, allWords, word })
export const updatePredictions = (word, prediction) => ({ type: UPDATE_PREDICTIONS, word, prediction })
export const analyzeWholeText = (words = []) => ({ type: ANALYZE_WHOLE_TEXT, words })