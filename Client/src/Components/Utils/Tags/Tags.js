import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';

import './Tags.css';

const KeyCodes = {
	comma: 188,
	enter: 13, 
	tab: 9
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

const datas = require('../../../Datas/tagSuggestions.json');

const Tags = (props) => {
	// handleDrag = (tag, currPos, newPos) => {
	// 	const tags = [...this.state.tags]
	// 	const newTags = tags.slice()

	// 	console.log("currPos: " + currPos + ", newPos: " + newPos)
	// 	console.log(tag)
	// 	newTags.splice(currPos, 1)
	// 	newTags.splice(newPos, 0, tag)

	// 	/* re-render */
	// 	this.setState({ tags: newTags })
	// }
	return (
		<div className={props.divclassname}>
			<h3 className={props.h3classname}>{props.title}</h3>
			{props.styling ?
			<ReactTags
				classNames={{
					tags: 'tagsClass',
					tagInput: 'TagInputClass', 
					tagInputField: 'tagInputFieldClass',
				}}
				tags={props.tags}
				suggestions={datas.suggestions}
				handleDelete={props.handleDelete}
				handleAddition={props.handleAddition}
				// handleDrag={this.handleDrag.bind(this)}
				delimiters={delimiters}
				minQueryLength={1}
				inputFieldPosition="top"
				allowDeleteFromEmptyInput={false}
				allowDragDrop={false}
			/>
			:
			<ReactTags
				tags={props.tags}
				suggestions={datas.suggestions}
				handleDelete={props.handleDelete}
				handleAddition={props.handleAddition}
				// handleDrag={this.handleDrag.bind(this)}
				delimiters={delimiters}
				minQueryLength={1}
				inputFieldPosition="top"
				allowDeleteFromEmptyInput={false}
				allowDragDrop={false}
			/>}
		</div>
	)
}

export default Tags
