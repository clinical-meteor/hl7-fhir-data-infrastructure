import { CardActions, CardText, CardTitle, RaisedButton, TextField } from 'material-ui';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';
 


const SortableItem = SortableElement(({value}) => <li style={{listStyleType: 'none'}}>
    SortableItem
    {/* <TextField value={value} /> */}
</li>);


const SortableList = SortableContainer(({items}) => {
  return (
    <ul style={{cursor: 'pointer', listStyleType: 'none'}}>
      {items.map((value, index) => (
        <SortableItem className='sortableItem' key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});



export class SortableQuestionnaire extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        items: this.props.items
    };
    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };
    render() {
      console.log('SortableQuestionnaire.state', this.state)
        // return <SortableList className='sortableList' items={this.state.items} onSortEnd={this.onSortEnd} />;
        return(<div>SortableList</div>)
    }
}

export default SortableQuestionnaire;
