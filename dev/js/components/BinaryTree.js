import React from 'react'
export default function BinaryTree({words}) {
	if (!words) return <div className="bt-placeholder">&nbsp;</div>
	return <div className="bt">
		<div>{words.str}</div>
		<span>{words.predictions.map((x,i) => <i key={i} className="bt-prediction">{x}</i>)}</span>
		<div className="bt-children">
			<BinaryTree words={words.lower} /> 
			<BinaryTree words={words.higher} /> 
		</div>
	</div>
}