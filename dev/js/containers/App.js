import React from 'react'
import {connect} from 'react-redux'

import BinaryTree from '../components/BinaryTree'
import * as actions from '../actions'


require('../../scss/style.scss')


class App extends React.Component {

	constructor(props) {
		super(props)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.handleCarretMove = this.handleCarretMove.bind(this)
		this.analyzeText = this.analyzeText.bind(this)
		this.readSingleFile = this.readSingleFile.bind(this)

		this.state = {
			showTree: false
		}
	}

	handleInputChange(evt) {
		this.props.dispatch(actions.setInputVal(evt.target.value))
		this.handleCarretMove(evt) // detect last full word based on where the carret is
	}

	handleKeyDown(evt) {
		let {dispatch, wordTree, lastWord, inputVal, prediction} = this.props

		switch(evt.key) {
			case ' ':
				let allWords = evt.target.value.split(' '),
					newWord = allWords.slice(-1)[0]
				dispatch(actions.addWord(newWord)) // try to add new word
				dispatch(actions.updatePredictions(lastWord, newWord)) // update predictions of lastWord
				this.handleInputChange(evt)
				return 
			case 'Tab':
				// accept prediction
				evt.preventDefault()
				let wordsBefore = inputVal.slice(0, inputVal.lastIndexOf(' '))
				if (!wordsBefore || !prediction) return
				
				dispatch(actions.updatePredictions(lastWord, prediction)) // update predictions of lastWord
				evt.target.value = `${wordsBefore} ${prediction} `
				//dispatch(actions.setLastWord(words, prediction)) // next last word is the prediction
				//dispatch(actions.setInputVal(`${wordsBefore} ${prediction} `)) // paste the displayed prediction into the input plus a space char
				this.handleInputChange(evt)
				return
		}
		this.handleCarretMove(evt)
	}
	
	handleCarretMove(evt) {
		let {dispatch, lastWord, wordTree} = this.props,
			carretPos = evt.target.selectionStart,
			wordsBefore = evt.target.value.slice(0, carretPos).match(/(\w+\ )/g), // complete words before carret
			str
		
		if (wordsBefore) str = wordsBefore.slice(-1)[0].trimRight() // get last complete word
			
		if (str && str !== lastWord.str) {
			// only update if something changed
			dispatch(actions.setLastWord(wordTree, str))
		}
		
	}

	analyzeText(text) {
		this.props.dispatch(actions.analyzeWholeText(text.split(/[^\w]/)))
	}

	readSingleFile(evt) {
	    //Retrieve the first (and only!) File from the FileList object
	    let f = evt.target.files[0],
	    	analyze = this.analyzeText

	    if (f) {
	    	let r = new FileReader()
	    	r.onload = function(e) { 
	    		analyze(e.target.result)
	    	}
	    	r.readAsText(f)
	    } else { 
	    	throw new Error("Failed to load file")
	    }
	}

	render() {
		let {wordTree, lastWord, inputVal, prediction} = this.props,
			currentWord = inputVal.slice(inputVal.lastIndexOf(' ')+1),
			textBefore = inputVal.slice(0, inputVal.lastIndexOf(' '))

		return <div>
	        <h1>Wortvorschläge</h1>
	        <div className="input-wrapper">
	        	<div className="input-predictions">{textBefore} {prediction ? <span>{prediction.slice(0, currentWord.length)}<b>{prediction.slice(currentWord.length)}</b></span> : null}</div>
	        	<textarea className="input-field" cols="60" rows="10" placeholder="Bitte Wörter eingeben" onKeyDown={this.handleKeyDown} onChange={this.handleInputChange} value={inputVal} onClick={this.handleCarretMove} />
	        </div>
	        <p>letztes Wort: {lastWord.str}</p>
	        <input type="file" onChange={this.readSingleFile} multiple={false} accept="text/plain" defaultValue="Textdatei analysieren" />
	        <h2>Wortbaum</h2>
	        <input type="checkbox" onChange={() => this.setState({showTree: !this.state.showTree})}/>anzeigen (vermindert performance!)
	       {
	       		this.state.showTree ?
	        	<BinaryTree words={wordTree} /> : null
	       }
	    </div>
	}
    
}

function memoize(fn) {
	let memoArgs = [],
		memoRes
	return (...args) => {
		if (args.find(x => !memoArgs.includes(x))) {
			// all args are the same -> return memoized res
			return memoRes
		}
		memoArgs = args
		memoRes = fn(...args)
		return memoRes
	}
}

function getWordFromTree(word, currWord) {
	if (!word) return ''
	if (word.str.indexOf(currWord) === 0) return word.str
	return getWordFromTree(word.lower, currWord) || getWordFromTree(word.higher, currWord)
}

function getBestMatch(wordTree, lastWord, inputVal) {
	let currWord = inputVal.split(' ').slice(-1)[0]
	// get best matching prediction
	if (currWord === '' && !lastWord.predictions[0]) return wordTree.str || ''
	if (currWord === '') {
		// just return first prediction
		return lastWord.predictions[0] 
	}
	return lastWord.predictions.find(x => x.indexOf(currWord) === 0) || getWordFromTree(wordTree, currWord)
}


function mapStateToProps({words, lastWord, inputVal}) {
    return {
        wordTree: words,
        lastWord,
        inputVal,
        prediction: getBestMatch(words, lastWord, inputVal) // this is a string
    }
}

export default connect(mapStateToProps)(App)