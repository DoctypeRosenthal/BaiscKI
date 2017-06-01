import React from 'react'
import {connect} from 'react-redux'

import BinaryTree from '../components/BinaryTree'
import * as actions from '../actions'


require('../../scss/style.scss')

class App extends React.Component {

	constructor(props) {
		super(props)
		this.onEnterText = this.onEnterText.bind(this)
		this.handleCarretChange = this.handleCarretChange.bind(this)
		this.analyzeText = this.analyzeText.bind(this)
		this.readSingleFile = this.readSingleFile.bind(this)
		this.acceptPrediction = this.acceptPrediction.bind(this)
	}

	onEnterText(evt) {
		let {dispatch, words, lastWord} = this.props,
			inputWords = evt.target.value.split(' '),
			nextState = {}

		if (evt.key === ' ') {
			let word = inputWords.slice(-1)[0]
			dispatch(actions.addWord(word)) // try to add new word
			dispatch(actions.updatePredictions(lastWord, word)) // update predictions of lastWord
		}
		dispatch(actions.setInputVal(evt.target.value))
		
	}
	

	acceptPrediction(evt) {
		if (evt.key === 'Tab') {
			evt.preventDefault()
		
			let {words, dispatch, prediction, inputVal, lastWord} = this.props,
				wordsBefore = inputVal.split(' ').slice(0, -1).join(' ')
			
			dispatch(actions.setInputVal(`${wordsBefore} ${prediction} `)) // paste the displayed prediction into the input plus a space char
			dispatch(actions.setLastWord(words, prediction))
			dispatch(actions.updatePredictions(lastWord, prediction)) // update predictions of lastWord
		}

		this.handleCarretChange(evt) // detect last full word based on where the carret is
	}

	handleCarretChange(evt) {
		let {dispatch, lastWord, words} = this.props,
			carretPos = evt.target.selectionStart,
			wordsBefore = evt.target.value.slice(0, carretPos).split(' '), // words before carret
			str = evt.key === ' ' ? wordsBefore.slice(-1)[0]  : wordsBefore.slice(-2)[0] // get last complete word
		if (lastWord.str !== str) {
			dispatch(actions.setLastWord(words, str))
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
	    		let contents = e.target.result
	    		analyze(contents)
	    	}
	    	r.readAsText(f)
	    } else { 
	    	alert("Failed to load file")
	    }
	}

	render() {
		let {words, lastWord, inputVal, prediction} = this.props

		return <div>
	        <h1>Wortvorschläge</h1>
	        Bitte Wörter eingeben:
	        <div className="inputWrapper">
	        <label htmlFor="input"><i>{inputVal.slice(0, inputVal.lastIndexOf(' '))}</i> {prediction ? <span>{prediction}</span> : null}</label>
	        	<input id="input" onKeyDown={this.acceptPrediction} onChange={this.onEnterText} value={inputVal} onClick={this.handleCarretChange} />
	        </div>
	        <p>letztes Wort: {lastWord.str}</p>
	        <input type="file" onChange={this.readSingleFile} multiple={false} accept="text/plain" defaultValue="Textdatei analysieren" />
	        <h2>Wortbaum</h2>
	        <BinaryTree words={words} />
	    </div>
	}
    
}

function mapStateToProps({words, lastWord, inputVal}) {
    return {
        words,
        lastWord,
        inputVal,
        prediction: lastWord.predictions.find(x => x.indexOf(inputVal.split(' ').slice(-1)[0]) === 0) || lastWord.predictions[0] // get best matching prediction
    }
}

export default connect(mapStateToProps)(App)