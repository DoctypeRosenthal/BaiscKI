
function word(state = { lower, str: '', higher }, action) {
	switch(action.type) {
		case NEW_WORD:
			if (!state) {
				// this word doesn't exist yet
				return {
					lower,
					str: action.str, 
					higher
				}
			}
			else if (state.str === action.str) {
				// word already exists
				return state
			}
			
			// Word is lexicografically lower or higher. Recursively call this reducer 
			// either with the lower or higher word	accordingly.	
			return {
				lower: state.str > action.str ? word(state.lower, action) : state.lower,
				str: action.str,
				higher: state.str < action.str ? word(state.higher, action) : state.higher
			}

		default:
			return state
	}
}

export default combineReducers({
    word
})