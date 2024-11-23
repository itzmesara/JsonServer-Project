import axios from "axios";
import { useEffect, useState } from "react";
import "./Todo.css"; // Assuming you have a CSS file for styling

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("")
  const [editTitle,setEditTitle]=useState("");
  const [idx,setIdx]=useState(-1);
  const [desc,setDesc] = useState("")
  const [date,setDate] = useState("")
  


  useEffect(() => {
    fetchTodos();
  }, []);

  const getTime=()=>{
    const now=new Date();
    const hours=now.getHours().toString().padStart(2,"0");
    const min=now.getMinutes().toString().padStart(2,"0");
    const sec=now.getSeconds().toString().padStart(2,"0");
    const date=now.getDate().toString();
    const month=now.getMonth().toString();
    const year=now.getYear().toString();
    var nyr=year%100;
    const days=["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const dayNumber=now.getDay();
    const day=days[dayNumber];
    var noon="AM"
    var Nhrs=hours;
    if(hours>12)
    {
      Nhrs=hours-12;
      noon="PM";
    }
    const time=Nhrs+":"+min+":"+sec+" "+noon+" "+date+"/"+month+"/"+nyr+" "+day;
    
    return time;
  }

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/List");
      setTodos(response.data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  const handleSubmit = async () => {
    if (title && description) {
      getTime()
      try {
        await axios.post("http://localhost:3000/List", { title, description,date: getTime()});
        setMsg("Added Successfully");
        setError("");
        setTitle("");
        setDescription("");
        fetchTodos();
        
      } catch (err) {
        console.error("Failed to add todo:", err);
        setError("Failed to Add");
        setMsg("")
      }
    } else {
      setError("Please enter both title and description");
      setMsg("");
    }
    setTimeout(()=>{
        setMsg("")
        setError("")
      },3000)
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/List/${id}`);
      setMsg("Deleted Successfully");
      setError("")
      fetchTodos();
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setError("Failed to Delete");
      setMsg("");
    }
    setTimeout(()=>{
        setMsg("")
        setError("")
      },3000)
  };

  const handleEdit = (title, description, index) => {
    setIdx(index);
    setEditTitle(title);
    setDesc(description);
  };
  const handleUpdate =async (id, title, description,index) =>{
    setIdx(index);
    setEditTitle(title);
    setDesc(description);
    if(editTitle&&desc)
    {
    try{
        await axios.put(`http://localhost:3000/List/${id}`, { title:editTitle, description:desc,date:getTime()});
        setMsg("Updated Successfully");
        setError("")
        fetchTodos();
      } catch (err) {
        setMsg("")
        setError("Error in update")
      }
      setIdx(-1);
    }
    else{
        setError("Please enter both title and description");
        setMsg("")
    }
      setTimeout(()=>{
        setMsg("")
        setError("")
      },3000)
    }
  

  return (
    <div className="todo-container">
      <h1>TODO LIST</h1>
      {msg && <p className="message">{msg}</p>}
      {error && <p className="error">{error}</p>}
      <div className="input-container">
        <input
          type="text"
          placeholder="Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit} >"Submit"</button>
      </div>
      <div className="todos-container">
        {todos.map((item,index) => (
          <div key={item.id} className="todo-item">
            <div className="todo-list-val ">
            <div className="title">{idx===index ? <input type="text" value={editTitle} onChange={(e)=>setEditTitle(e.target.value)}/>:<h3>{item.title}</h3>}</div>
            <div className="desc">{idx===index?<input type="text" value={desc} onChange={(e)=>setDesc(e.target.value)}/>:<p>{item.description}</p>}</div>
            </div>
            <div className="grid-center">
              {
                idx===index?"":
                item.date
              }
              </div>
            {
                idx===index?
                <div className="grid-center">
                <button className="update-btn" onClick={()=> handleUpdate(item.id,editTitle,desc,index)}>Update</button>
                </div>
                :
                <div className="grid-center">
                <button className="edit-btn" onClick={() => handleEdit(item.title,item.description,index)}>Edit</button>
                </div>
            }
            <div className="grid-center">
            <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todo;
