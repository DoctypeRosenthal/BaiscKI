import {
	SET_INPUT_VAL,
	NEW_WORD,
	SET_LAST_WORD,
	UPDATE_PREDICTIONS,
	FIND_WORD,
	ANALYZE_WHOLE_TEXT
} from './actions/names'

import {combineReducers} from 'redux'

function inputVal(state = '', action) {
	switch(action.type) {
		case SET_INPUT_VAL:
			return action.str
		default:
			return state
	}
}
// predictions array is only small (50 entries or so)
function predictions(state = [], action) {
	switch(action.type) {

		case UPDATE_PREDICTIONS:
			let pos = state.indexOf(action.prediction)
			if (pos === 0 || !action.prediction) return state
			else if (pos === -1) {
				// selected word is not in array -> set it as the last word
				if (state.length < 50) return [...state, action.prediction]
				return [
					...state.slice(0, -1),
					action.prediction
				]
			}
			// selected word is already in the array an is not at the start -> move it one step forward
			return state
				.reduce((a, b, i, arr) => a.concat(i === pos-1 ? arr[pos] : i === pos ? arr[pos-1] : b), []) // swap items in array
				.slice(0, 50) // reduce array size to 50 entries max
		default:
			return state
	}
}

function words(state = { higher: undefined, str: '',  lower: undefined, predictions: [] }, action) {
	switch(action.type) {
		case ANALYZE_WHOLE_TEXT:
			let textAsWords = action.text
								.replace(/(\w+)\-\n(\w+)/g, "$1$2")
								.replace(/['"]([^'" ]+)['"]/g, "$1") // remove quotation marks
								.split(/[^\wäöüß']/), // connect words seperated by hyphen and split the text in a word array 
				nextState = state
			// traverse words tree for each new word. Always save the new words tree.
			textAsWords.forEach(x => nextState = words(nextState, {type: NEW_WORD, word: x}))
			textAsWords.forEach((x,i,arr) => {
				// add predictions to each word
				if (i > 0) {
					// we begin from second word
					nextState = words(nextState, {type: UPDATE_PREDICTIONS, word: words(nextState, {type: FIND_WORD, word: arr[i-1]}), prediction: x})
				}
			})

			return nextState

		case FIND_WORD:
			if (state.str === '' || state.str === action.word) {
				// found it or leaf reached without content
				return state
			}
			
			// Word is lexicografically lower or higher. Recursively call this reducer 
			// either with the lower or higher word	accordingly.	
			return words(action.word < state.str ? state.lower : state.higher, action)

		case NEW_WORD:
			if (state.str === '') {
				// this word doesn't exist yet
				return {
					higher: undefined,
					str: action.word, 
					lower: undefined,
					predictions: []
				}
			}
			else if (state.str === action.word) {
				// word already exists
				return state
			}
			
			// Word is lexicografically lower or higher. Recursively call this reducer 
			// either with the lower or higher word	accordingly.	
			if (action.word < state.str) {
				return {
					...state,
					lower: words(state.lower, action)
				}	
			}
			return {
				...state,
				higher: words(state.higher, action)
			}	

		case UPDATE_PREDICTIONS:
			if (action.word.str === state.str) {
				// word to be updated has been found -> update predictions
				return {
					...state,
					predictions: predictions(state.predictions, action)
				}
			}
			else if (action.word.str < state.str) {
				return {
					...state,
					lower: words(state.lower, action)
				}
			}
			return {
				...state,
				higher: words(state.higher, action)
			}

		default:
			return state
	}
}

function lastWord(state = words(undefined, {}), action) {
	switch(action.type) {
		case SET_LAST_WORD:
			return words(action.allWords, {word: action.word, type: FIND_WORD})
		default:
			return state	

	}
}

export default combineReducers({
    words,
    lastWord,
    inputVal
})