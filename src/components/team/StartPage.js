/**
 * render a the startpage
 */

 import User from './User'

 //import './UserList.css';
 
 function StartPage({users, globals, conferences, conferencetypes, info}) {
     return (
         <div className="StartPage">
             {
                 users.map(usr => <User key={usr.id} data={usr}/>)
             }
         </div>
     )
 }
 
 export default StartPage;