import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {IList} from '../../interfaces/list.interface';
import {IListItem} from '../../interfaces/listItem.interface';

export default function Lists() {
  const [lists, setLists] = useState<IList[]>([]);
  const [newItemNames, setNewItemNames] = useState<{ [listId: number]: string }>({});
  const [newListName, setNewListName] = useState<string>('');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  const getLists = async () => {
    const response = await axios.get<IList[]>('http://localhost:5000/list');

    if (response.status === 200) {
      setLists(response.data);
    }
  };

  const onItemChange = async (listItem: IListItem, checked: boolean) => {
    const response = await axios.put(`http://localhost:5000/item/${listItem.id}`, {
      name: listItem.name,
      listId: listItem.listId,
      completed: checked,
    });

    if (response.status === 200) {
      await getLists();
    }
  };

  const onListNameChange = (listId: number, value: string) => {
    const listNames = {...newItemNames};

    listNames[listId] = value;

    setNewItemNames(listNames);
  };

  const onAddNewItem = async (listId: number) => {
    const response = await axios.post(`http://localhost:5000/item`, {
      name: newItemNames[listId],
      listId,
    });

    if (response.status === 200) {
      const listNames = {...newItemNames};
      listNames[listId] = '';
      setNewItemNames(listNames);

      await getLists();
    }
  };

  const onNewList = async () => {
    const response = await axios.post('http://localhost:5000/list', {
      name: newListName,
    });

    if (response.status === 200) {
      setNewListName('');

      await getLists();
    }
  };

  useEffect(() => {
    (
      async () => {
        await getLists();
      }
    )();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <label htmlFor='show-completed'>Show Completed</label>
      <input type='checkbox' name='show-completed' id='show-completed' checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {lists.map((list) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', padding: '0.25rem', marginRight: '1rem', marginBottom: '1rem', minWidth: '270px', width: '280px', minHeight: '270px' }} key={list.id}>
            <h3 style={{ marginTop: '0' }}>{list.name}</h3>
            <h4>Items</h4>
            <ul>
            {list.listItems.filter((listItem) => showCompleted || !listItem.completed).map((listItem) => (
                  <li key={listItem.id}>
                  <span>{listItem.name}</span>
                  <input type='checkbox' name='completed' checked={listItem.completed} onChange={(e) => onItemChange(listItem, e.target.checked)} />
                  </li>
                  ))}
            </ul>
            <div style={{ flexGrow: 1 }} />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
            <input type='text' name='new-item' placeholder='New Item' value={newItemNames[list.id] ?? ''} onChange={(e) => onListNameChange(list.id, e.target.value)} />
            <button onClick={() => onAddNewItem(list.id)}>ADD</button>
            </div>
            </div>
            ))}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', padding: '0.25rem', marginRight: '1rem', marginBottom: '1rem', minWidth: '270px', width: '280px', minHeight: '270px' }} >
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
      <input type='text' name='new-list' placeholder='New List' value={newListName} onChange={(e) => setNewListName(e.target.value)} />
      <button onClick={() => onNewList()}>ADD</button>
      </div>
      </div>
      </div>
    </div>
  );
}
