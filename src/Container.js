import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import Card from './Card';

class Container extends Component {
	render() {
		const { list } = this.props;
		const { canDrop, isOver, connectDropTarget, move, remove } = this.props;
		const isActive = canDrop && isOver;
		const style = {
		};

		const backgroundColor = isActive ? 'lightpink' : '#FFF';

		return connectDropTarget(
			<div className="individualContainer" style={{...style, backgroundColor}}>
			<div className="listHeader">
			<p className="listTitle"> {this.props.title} </p>
			<p className="listTotal"> {list.length} Projects </p>
			</div>
			<div>
			{list.map((card, i) => {
				return (
					<Card 
					key={card.key}
					index={i}
					listId={this.props.id}
					card={card}														
					removeCard={remove}
					moveCard={move} />
					);
			})}
			</div>
			</div>
			);
	}
}

// This drop method sets the monitor.getDropResult()'s listId field
// that we're calling in Card.js cardSource(endDrag) method 
const cardTarget = {
	drop(props, monitor, component) {
		const { id } = props;
		const sourceObj = monitor.getItem();
		if(id !== sourceObj.listId )
			component.props.push(sourceObj.card);
		return {
			listId: id
		};
	}
}

export default DropTarget("CARD", cardTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
}))(Container);
