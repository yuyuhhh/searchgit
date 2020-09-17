import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import Container from './Container';
import './App.css';
import axios from 'axios';

class App extends Component {
	render() {
		return(
			<div>
			<GithubRepos />
			<TodoInput />
			</div>
			)
	}
}

var GithubRepos = React.createClass({
	getInitialState: function() {
		return {
			repos:  [],
			current: [], 
			important: [],
		};
	},
	getRepos: function(e) {
		var value = this._inputElement.value ;
		var array = this.state.repos;
		var that = this;

		if(value !== '') {
			axios.get("https://api.github.com/users/" + value + "/repos")
			.then(function (response) {
				console.log(response);
				{response.data.map(function(repo, i){
					return array.push({
						text: repo.html_url,
						key: i
					});
				})}
				that.setState({
					repos: array
				});
			})
			.catch(function (error) {
				console.log(error);
			});
		}

		value = "";
		e.preventDefault(); // impt!!
	},
	push: function(listName, card) {
		return function(card) {
			console.log("push");
			let newState = update(this.state, {
				[listName]: {
					$push: [card]
				}
			});
			console.log(newState);
			this.setState(newState);
		}
	},
	remove: function(listName) {
		return function(index) {
			console.log("remove");
			let newState = update(this.state, {
				[listName]: {
					$splice: [
					[index, 1]
					]
				}
			});
			console.log(newState);
			this.setState(newState);
		}
	},
	move: function(listName) {
		return function(dragIndex, hoverIndex) {
			console.log("parent move");
			const cards = this.state[listName];
			const dragCard = cards[dragIndex];
			let newState = update(this.state, {
				[listName]: {
					$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard],
					],
				}
			});
			console.log(newState);
			this.setState(newState);
		}
	},
	render: function() {
		var total = this.state.repos.length + this.state.current.length + this.state.important.length;
		var todoEntries = this.state.repos;
		function createTasks(item) {
			return <li key={item.key}>{item.text}</li>
		}
		var listItems = todoEntries.map(createTasks);
		return (
			<div className="mainList">
			<div className="header">
			<form onSubmit={this.getRepos}>
			<button type="submit">Search Github</button>
			<input ref={(a) => this._inputElement = a}  
			placeholder="a Github username"></input>
			</form>
			<ul className="totalItems">
			<li> TOTAL </li>
			<li id="totalNum"> { total } Projects </li>
			</ul>
			</div>
			<div className="listContainers">
			<Container push={this.push('repos').bind(this)} remove={this.remove('repos').bind(this)} move={this.move('repos').bind(this)} title={"All"} id={"todolist"} list={this.state.repos} />
			<Container push={this.push('current').bind(this)} remove={this.remove('current').bind(this)} move={this.move('current').bind(this)} title={"Current"} id={"inprogresslist"} list={this.state.current} />
			<Container push={this.push('important').bind(this)} remove={this.remove('important').bind(this)} move={this.move('important').bind(this)} title={"Important"} id={"done"} list={this.state.important} />
			</div>
			</div>
			);
	}

});

// To add more lists, create array to store items && 
// Add <Container ... /> component in render function below
var TodoInput = React.createClass({
	getInitialState: function() {
		return {
			todoitems:  [],
			inprogressitems: [],
			doneitems: [],
		};
	},
	addItem: function(e) {
		var itemArray = this.state.todoitems;

		// Adding object of text & key properties
		if(this._inputElement.value !== '') {
			itemArray.push({
				text: this._inputElement.value,
				key: Date.now()
			});

			this.setState({
				todoitems: itemArray
			});
		}

		this._inputElement.value = "";

		// Prevents triggering browser's default POST behavior
		e.preventDefault();
	},
	push: function(listName, card) {
		return function(card) {
			console.log("push");
			let newState = update(this.state, {
				[listName]: {
					$push: [card]
				}
			});
			console.log(newState);
			this.setState(newState);
		}
	},
	remove: function(listName) {
		return function(index) {
			console.log("remove");
			let newState = update(this.state, {
				[listName]: {
					$splice: [
					[index, 1]
					]
				}
			});
			console.log(newState);
			this.setState(newState);
		}
	},
	move: function(listName) {
		return function(dragIndex, hoverIndex) {
			console.log("parent move");
			const cards = this.state[listName];
			const dragCard = cards[dragIndex];
			let newState = update(this.state, {
				[listName]: {
					$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard],
					],
				}
			});
			console.log(newState);
			this.setState(newState);
		}
	},
	render: function() {
		var total = this.state.todoitems.length + this.state.inprogressitems.length + this.state.doneitems.length;
		return (
			<div className="mainList">
			<div className="header">
			<form onSubmit={this.addItem}>
			<button type="submit">add</button>
			<input ref={(a) => this._inputElement = a}  
			placeholder="enter task"></input>
			</form>
			<ul className="totalItems">
			<li> TOTAL </li>
			<li id="totalNum"> { total } Projects </li>
			</ul>
			</div>
			<div className="listContainers">
			<Container push={this.push('todoitems').bind(this)} remove={this.remove('todoitems').bind(this)} move={this.move('todoitems').bind(this)} title={"To Do"} id={"todolist"} list={this.state.todoitems} />
			<Container push={this.push('inprogressitems').bind(this)} remove={this.remove('inprogressitems').bind(this)} move={this.move('inprogressitems').bind(this)} title={"In Progress"} id={"inprogresslist"} list={this.state.inprogressitems} />
			<Container push={this.push('doneitems').bind(this)} remove={this.remove('doneitems').bind(this)} move={this.move('doneitems').bind(this)} title={"Done"} id={"done"} list={this.state.doneitems} />
			</div>
			</div>
			);
	}
});

export default DragDropContext(HTML5Backend)(App);
