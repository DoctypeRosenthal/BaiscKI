import React from 'react'
export default function BinaryTree({words}) {
	return <div className="bt">
		<div>
			<div>{words.str}</div>
			<span>{words.predictions.map((x,i) => <i key={i} className="bt-prediction">{x}</i>)}</span>
		</div>
		<div className="bt-child">{
			!words.lower ? null :
			<BinaryTree words={words.lower} /> 
		}
		</div>
		<div className="bt-child">{
			!words.higher ? null :
			<BinaryTree words={words.higher} /> 
		}
		</div>
	</div>
}