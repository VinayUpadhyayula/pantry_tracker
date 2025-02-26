'use client'
import { Button } from "@mui/material";
import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, setDoc, query, onSnapshot, QuerySnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PlusIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useAuth } from "../authcontext";
import { useRouter } from "next/navigation";
import { Camera } from "react-camera-pro";
import { CameraComp } from "../CameraComp";
import {convertImageToBase64, run} from "../genai/app";
import Alert from '@mui/material/Alert';

import * as dotenv from "dotenv";

export default function PantryPage() {
  type Item = {
    name: string;
    quantity:number;
    image?:string;
  }
  // dotenv.config({ path: '../.env' });
  const { user, logout } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState<Item>({ name: '', quantity: 0});
  const [loading, setLoading] = useState(true);
  const camera: any = useRef(null);
  const [image, setImage] = useState('');
  const [displayImage, setDisplayImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [airesp, setAIResponse] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const[alert, setAlert] = useState('');
  const [webcam, setWebcam] = useState(false);
  let api_key = process.env.REACT_APP_API_KEY
  //  console.log(api_key);
  const callGeminiAndSaveToDB = async ()=>{
    const base64Image = convertImageToBase64(image)
    const result = await run(image,api_key);
    const {item_name, image_descr} =  JSON.parse(result.response.text());
    console.log(item_name, image_descr);
    setAIResponse(image_descr);
    setNewItem({name:item_name, quantity:1,image:image});
    console.log(newItem)
    const ele = document.getElementById('imageFile')
    if(ele && ele instanceof HTMLInputElement)
      ele.value = ''
  }
  const webcamRef = useRef(null);

  const toggleWebcam = () => {
    setWebcam(!webcam);
  }
 
  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
    console.log(searchQuery);
  };
  const handleFileUpload = (e:any)=>{
    const file = e.target.files[0]
    // console.log(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
    setImage(reader.result as string);
    //  console.log(reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };

  }
  useEffect(() => {

    let filteredItemsArr: any = [];
    if (searchQuery == '') {
      setFilteredItems(items);
    }
    else {
      items.filter((item: any) => {
        console.log(item, searchQuery);
        if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          filteredItemsArr.push(item)
        }
      })
      console.log(filteredItemsArr)
      setFilteredItems(filteredItemsArr);
    }
  }, [searchQuery]
  );

  useEffect(() => {
    if (!user) {
      console.log('entered')
      router.push('/');
    }
  }, [user, loading, router]);


  const addItem = async (e: any) => {
    if(e)
      e.preventDefault();
    console.log(newItem);
    items.map((item:Item)=>{
      if(item.name == newItem.name.trim())
      {
        setAlert('Item'+item.name+' already exists! Please add a different one');
      }
    })
    if(alert==''){
      if (newItem.name != '') {
        console.log('saving to db...')
        await addDoc(collection(db, 'items'), {
          name: newItem.name.trim(),
          quantity: newItem.quantity,
          image: newItem.image
        });
        setNewItem({ name: '', quantity: 0, image:''});
        setImage('')
        setAIResponse('')
        // setItems({...items,newItem});
      }
  }
  }
  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'items', id));
  }
  const updateItem = async (id: string, quantity: number) => {
    await updateDoc(doc(db, 'items', id), {
      quantity: quantity
    })
  }
  useEffect(() => {
    try {
      const q = query(collection(db, 'items'))
      const unsubscribed = onSnapshot(q, (querySnapshot) => {
        let itemsArr: any = []
        querySnapshot.forEach((doc) => {
          itemsArr.push({ ...doc.data(), id: doc.id })
        })
        setItems(itemsArr);
        setFilteredItems(itemsArr);// for the first time loading
      });
    } catch (e) {
      console.log('error', e);
    }
    finally {
      setLoading(false);
    }
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">
          Hello, {' '}
          <span className="bg-gradient-to-r from-pink-500 via-yellow-500 to-teal-500 text-transparent bg-clip-text font-semibold">
            {user?.displayName || 'Guest'}
          </span>
        </h1>
        <button
          onClick={logout}
          className="relative bg-slate-950 text-white p-3 rounded-lg hover:bg-slate-900 border-2 border-transparent hover:border-slate-200 flex items-center justify-center transition-all duration-300"
        >
          <span className="mr-2">Logout</span>
          <span className="absolute inset-0 border-2 border-slate-200 rounded-lg pointer-events-none"></span>
        </button>
      </div>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )
          :
          (
            <div className="bg-slate-800 p-4 rounded-lg">
              {alert ? (<Alert severity="error" onClose={() => {setAlert('')}}>{alert}</Alert>) : (<></>)}
              <form className="grid grid-cols-6 gap-x-4 items-center text-black">
                <input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="col-span-3 p-3 border rounded-lg" type="text" placeholder="Enter Item"></input>
                <input
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  className="col-span-2 p-3 border rounded-lg"
                  type="number"
                  min="1"
                  placeholder="Qty"
                />
                {!(newItem.name == '' || newItem.quantity == 0)}
                <button
                  onClick={addItem}
                  disabled = {newItem.name === '' || newItem.quantity == 0}
                  className="text-white bg-slate-950 rounded-lg hover:bg-slate-900 p-3 text-xl disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
                  <PlusIcon className="h-6 w-6 mr-1" />
                  Add Item</button>

              </form>
              <div className="flex-col items-center justify-between p-4">
                {displayImage ?
                  (
                    
                    <CameraComp image={image} setImage = {setImage} setDisplayImage = {setDisplayImage}></CameraComp>

                  )

                  : (<></>)}
                <button className="bg-blue-600 p-2 rounded-md w-medium" onClick={() => {
                  setDisplayImage(true);
                }
                }>Take Photo
                </button>
                <input className = "p-2" type="file" id="imageFile" name="imageFile" accept="image/*" onChange={e=>handleFileUpload(e)}/>
                {/* <button className="bg-blue-600 p-2 rounded-md w-medium" onClick = {handleFileUpload}>Upload File</button> */}
                {image ? 
                  (
                    <div className="flex-col items-center justify">
                    <img className="w-95 h-64 mt-2 object-cover" src={image} alt='Taken photo' />
                    <button className="bg-blue-600 p-2 rounded-md w-medium" onClick={(env) => {
                      callGeminiAndSaveToDB();
                    }
                    }>Upload Image
                    </button>
                  </div>
                  ) 
                  :(<></>)
                }
                {airesp ? (<div><span>AI Description of image: </span><span>{airesp}</span></div>): (<></>)}
              </div>
              <input
                type="text"
                className="text-black p-2 border rounded w-full mb-4"
                placeholder="Search items..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <ul>
                {filteredItems.map((item: any, id) => (
                  <li key={id} className="my-4 w-full flex justify-between bg-slate-950">
                    <div className="p-4 w-full flex justify-between">
                      <span className="capitalize">{item.name}</span>
                      <input
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, parseInt(e.target.value))}
                        className="text-black p-1 border rounded-md w-20 text-center"
                        type="number"
                        placeholder={item.quantity}
                      />
                      {/* <span>{item.quantity}</span> */}
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">
                      <TrashIcon className="h-6 w-6" /></button>
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </div>
    </main>
  );
}
