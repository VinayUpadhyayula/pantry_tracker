'use client'
import { Button } from "@mui/material";
import Reacr,{useState,useEffect} from 'react';
import {collection, addDoc, setDoc,query, onSnapshot, QuerySnapshot, deleteDoc, doc} from 'firebase/firestore';
import {db} from './firebase';

export default function Home() {
  type Item ={
    name:string;
    id?:string;
  }
  const [items,setItems] = useState([]);
  const [newItem,setNewItem] = useState({name:''});
  const addItem = async(e:any)=>{
    e.preventDefault();
    if(newItem.name !=''){
      console.log('enetred');
      await addDoc(collection(db,'items'),{
        name:newItem.name.trim()
      });
      setNewItem({name:''});
      // setItems({...items,newItem});
    }
  }
  const deleteItem = async(id:string) =>{
    await deleteDoc(doc(db,'items',id));
  }
  useEffect(()=>{
    const q = query(collection(db,'items'))
    const unsubscribed = onSnapshot(q,(querySnapshot)=>{
      let itemsArr:any =[]
      querySnapshot.forEach((doc)=>{
        itemsArr.push({...doc.data(),id:doc.id})
      })
      setItems(itemsArr);
    });
  },[])
  return (
    <main className="flex min-h-screen flex col items-center justify between sm:p-24 p-4"> 
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-4 items-center text-black">
            <input 
            value={newItem.name}
            onChange = {(e) =>setNewItem({...newItem,name:e.target.value})}
            className ="col-span-3 p-3 border rounded-lg" type = "text" placeholder="Enter Item"></input>
            <button 
            onClick={addItem}
            className = "text-white bg-slate-950 rounded-lg hover:bg-slate-900 p-3 text-xl" type="submit">Add Item</button>
          </form>
          <ul>
            {items.map((item:any,id) => (
              <li key ={id} className="my-4 w-full flex justify-between bg-slate-950">
                <div className="p-4 w-full flex justify between">
                  <span className="capitalize">{item.name}</span>
                  </div>
                  <button
                  onClick={()=>deleteItem(item.id)}
                  className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
