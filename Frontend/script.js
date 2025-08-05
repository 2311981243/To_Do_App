function ui(task,taskId,status)
  {
    console.log(status)
    let p=document.createElement('p')
   let remove=document.createElement('button')
   let edit=document.createElement('button')
   let div=document.createElement("div")
   let check=document.createElement("input")
   check.type="checkbox"
   p.innerText=task
   remove.innerText="Delete"
   edit.innerText="Edit"
   edit.addEventListener('click',()=>
{
    let newValue=prompt("Enter a new value for this task")
    fetch(`/editTask/${taskId}`,{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({newValue:newValue})
    })
    p.innerText=newValue
})
check.addEventListener('click',()=>
{
    status=!status; 
    p.style.textDecoration=status ? 'line-through' : 'none';

    fetch(`/updateStatus/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status })
    })
})
 if (status) 
  {
    p.style.textDecoration='line-through';
    check.checked=true;
} 
else 
  {
    p.style.textDecoration = 'none';
    check.checked=false;
  }

   div.append(check)
   div.append(p)
   div.append(remove)
   div.append(edit)
   remove.addEventListener('click',()=>
  {
    list.removeChild(div)
    fetch(`/deleteTask/${taskId}`,{
      method:"DELETE"
    })
  })
  
   document.getElementById('list').append(div)
   document.getElementById("task").value=""
  }
  fetch('/getTask')
  .then(res=>res.json())
  .then((val)=>
{
  val.forEach((data)=>
{
  ui(data.task,data._id,data.status)
})
})
.catch(err)
{
  console.log("error")
}
function add(event)
{
  event.preventDefault()
  let task=document.getElementById("task").value
  fetch('/addTask',{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({task:task})
  })
  .then(res=>res.json())
  .then((val)=>
{
   ui(val.msg.task,val.msg._id,val.msg.status)
})
.catch(err => console.error("Error adding task:", err));
}
